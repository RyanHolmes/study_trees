"use strict";
class Node {
  // literally nothing
};
Node.prototype.create = function (id, text, children, note) {
  this.id = id;
  this.text = text;
  this.children = children;
  this.note = note;
};

Node.prototype.setDate = function (date) {
  this.date = date;
};

// Node.prototype.children = [];
