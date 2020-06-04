// Copyright 2020 The Regents of the University of California

// Created by Adam Smith (amsmith@ucsc.edu)
// Department of Computational Media, UC Santa Cruz

// Unless otherwise stated, all files in this project
// except README.md, rules.js, and story.toml are in
// the state they were provided to students as part of
// a data structures course assignment.

/* global toml */
/* global titleContainer storyContainer choicesContainer */
/* global start applyChoice */

const engine = {
  run: domain_source => {
    fetch(domain_source).then(async response => {
      engine.reset();
      start(await response.text());
    });
  },
  reset: () => {
    document.title = "";
    titleContainer.innerHTML = "";
    storyContainer.innerHTML = "";
    choicesContainer.innerHTML = "";
  },
  setTitle: text => {
    if (typeof text != "string") {
      console.error("Title should be a string!");
    }
    document.title = text;
    titleContainer.innerHTML = text;
  },
  appendChunk: text => {
    if (typeof text != "string") {
      console.error("Chunk text should be a string!");
    }
    let p = document.createElement("p");
    p.innerHTML = text;
    storyContainer.appendChild(p);
  },
  provideChoices: items => {
    if (!Array.isArray(items)) {
      console.error("Provided choices should be an array!");
    }
    choicesContainer.innerText = "";
    for (let item of items) {
      const button = document.createElement("button");
      if (typeof item.text != "string") {
        console.error("Choice item", item, "should have a string .text field!");
      }
      button.innerHTML = item.text;
      if (typeof item.target != "string") {
        console.error(
          "Choice item",
          item,
          "should have a string .target field!"
        );
      }
      button.onclick = () => {
        applyChoice(item.target);
      };
      choicesContainer.appendChild(button);
    }
    window.scrollTo(0, document.body.scrollHeight);
  }
};

engine.run(document.currentScript.dataset.domainSource);
