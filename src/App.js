var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
import { hashHistory } from 'react-router'
var ArticlesContainer = require('./ArticlesContainer');

var NoMatch = React.createClass({
  render: function() {
    return (
      <h2>No match for the route</h2>
    );
  }
});

ReactDOM.render(
  (
    <Router history={hashHistory} >
      <Route path="/" component={ArticlesContainer} />
      <Route path="*" component={NoMatch} />
    < /Router >
  ),
  document.getElementById('main')
);
