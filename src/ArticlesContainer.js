var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Link = require('react-router').Link;
var Infinite = require('react-infinite');

var article_url = "http://www.stellarbiotechnologies.com/media/press-releases/json"

var ArticleRow = React.createClass({
    getDefaultProps: function() {
        return {
            height: 100,
        }
    },
    render : function() {
        return(

            <div className="infinite-list-item"  style={
                {
                    height: this.props.height,
                    overflow: 'scroll'
                }
            }>
                <div style={{height: 50}}>
                    <h4>{this.props.article.title}</h4>
                    <p>{this.props.article.published}</p>
                </div>
            </div>
        )
    }

})

var ArticlesContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        console.log(['GETTING STATE'])
        return {articles: [],
                isInfiniteLoading: false,
                filter:{limit:20, offset:0}
        };
    },
    loadData : function(filter){
        console.log(["URL", article_url + '?' + $.param(filter)])
        $.ajax(article_url + '?' + $.param(filter)).done(function(data){
            console.log(["SETTING AJAX DATA TO STATE", data.news])
            this.setState({articles:data.news})
        }.bind(this));
    },
    componentDidMount: function(){
        this.serverRequest = $.get(article_url + '?' + $.param(this.state.filter), function (result) {
          var newArticles = {articles:result.news};
          this.setState(
            newArticles
          );
        }.bind(this));
        console.log(['MOUNT FILTER', this.state])
    },
    componentWillUnmount: function() {
        console.log("UNMOUNTING")
        this.serverRequest.abort();
      },
    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },
    handleInfiniteLoad: function() {
        var that = this;        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(function() {
            var elemLength = that.state.articles.length
            var newFilter = that.state.filter
            newFilter.limit += 5
            that.loadData(newFilter);
            that.setState({
                isInfiniteLoading: false,
                filter: newFilter
            });
        }, 2500);
    },
    render: function(){
        console.log(["ARTICLES ON RENDER", this.state])
        var articleRows = this.state.articles.map(function(article, i){
            return(
                <ArticleRow key={article.title} index={i} article={article} />
            );
        })
        return(
            <div id="article-list">
                <h1>Article Listings</h1>
                <Infinite loadingSpinnerDelegate={this.elementInfiniteLoad()}
                        onInfiniteLoad={this.handleInfiniteLoad}
                        containerHeight={700} elementHeight={100}
                        isInfiniteLoading={this.state.isInfiniteLoading}
                        infiniteLoadBeginEdgeOffset={200}
                        timeScrollStateLastsForAfterUserScrolls={1000}
                        >
                    {articleRows}
                </Infinite>
            </div>
        )
    }
});

module.exports = ArticlesContainer;