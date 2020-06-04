/* global toml */
/* global engine */
let domain = undefined;
let inventory = undefined;

function start(text) {
  domain = toml.parse(text);

  // I should initialize some data structure that will
  // allow me to keep track of which storylets have been
  // chosen by the player.
  inventory = new Set();

  // I should use engine.setTitle(___) to set the title
  // of my story.
  engine.setTitle(domain.title);
  // I should use engine.appendChunk(___) to display the
  // one or more narrative chunks in my story's introduction.
  if (Array.isArray(domain.introduction)) {
    for (let sequence of domain.introduction) {
      engine.appendChunk(sequence);
    }
  } else {
    engine.appendChunk(domain.introduction);
  }
  // I should use engine.provideChoices(___)
  let choices = [];

  for (let part of Object.keys(domain.storylets)) {
    if (inventory.has(part)) {
      continue;
    }
    //Thank you for the help with the choices, Henry!
    let section = domain.storylets[part];

    if (section.requires && !conditionChecker(section.requires)) {
      continue;
    }

    if (section.conflicts && conditionChecker(section.conflicts)) {
      continue;
    }

    choices.push({
      text: section.name,
      target: part
    });
  }
  engine.provideChoices(choices);
}

function applyChoice(target) {
  // I should record that the storylet identied by `target`
  // has been selected.
  inventory.add(target);
  // I should use engine.appendChunk(___)
  let story = domain.storylets[target];
  if (Array.isArray(story.description)) {
    for (let sequence of story.description) {
      engine.appendChunk(sequence);
    }
  } else {
    engine.appendChunk(story.description);
  }

  let choices = [];

  for (let part of Object.keys(domain.storylets)) {
    if (inventory.has(part)) {
      continue;
    }

    let section = domain.storylets[part];

    if (section.conflicts && conditionChecker(section.conflicts)) {
      continue;
    }

    if (section.requires && !conditionChecker(section.requires)) {
      continue;
    }

    choices.push({
      text: section.name,
      target: part
    });
  }
  engine.provideChoices(choices);
}
//I followed the outline of the algorithm from the Slides Doc (Slide 15) to type out the code for this function. Thank you for providing that, Adam!
function conditionChecker(condition) {
  if (typeof condition == "string") {
    condition = [condition];
  }

  if (typeof condition[0] == "string") {
    condition = [condition];
  }

  for (let disjunct of condition) {
    let satisfied = true;
    for (let conjunct of disjunct) {
      if (!inventory.has(conjunct)) {
        satisfied = false;
      }
    }

    if (satisfied) {
      return true;
    }
  }
  return false;
}
