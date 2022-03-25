/*
  KeyValuePair

  Helper class to represent a key-value pair in QuoteStats' Map.
*/
class KeyValuePair {
  constructor() {
    this.key = null;
    this.value = null;
  }

  update(key, value) {
    this.key = key;
    this.value = value;
  }

  clear() {
    this.key = null;
    this.value = null;
  }
}

/*
  QuoteStats

  Add words to a Map, then rank words based on their prevalance.
*/
class QuoteStats {
  constructor() {
    // words and the number of times they have occurred
    this.wordsAndCounts = new Map();
    // top three words and their number of occurrences
    this.maxKeyValues =
      [new KeyValuePair(), new KeyValuePair(), new KeyValuePair()];
    // word sanitisation
    this.punctuation = /["\.\,\;\:\-\_\=\+\'\[\{\}\]\?\!()\|\\\/\<\>\@\#\$\%\^\&\*]/ig;
    this.unwantedWords = [
      'the', 'an', 'a', 'for', 'from', 'to', 'of', 'are', 'is', 'it', 'it\'s',
      'as', 'in', 'than', 'what', 'with', 'or', 'and', 'that', 'on', 'at', 'by',
    ];
  }

  /*
    sanitiseWord
    word : String

    Remove unnecessary characters from the word and ensure that the word is
      interesting (e.g. isn't a preposition). Return sanitised word.
  */
  sanitiseWord(word) {
    word = word.toLowerCase().replaceAll(this.punctuation, '');
    if (this.unwantedWords.includes(word)) {
      return '';
    }
    return word;
  }

  /*
    addWord
    word : String

    Try to add the given string to the Map. Return true if addition succeeds.
      Return false if addition fails.
  */
  addWord(word) {
    // sanitise word -- if nothing remains after sanitisation then quit
    word = this.sanitiseWord(word);
    if (word === '') {
      return false;
    }
    // if we already have this word stored
    if (this.wordsAndCounts.has(word)) {
      let newValue = this.wordsAndCounts.get(word) + 1;
      this.wordsAndCounts.set(word, newValue);
      // Start ranking readjustment
      // if this new value is higher than #1
      if (newValue >= this.maxKeyValues[0].value) {
        // if the word is not already #1, then readjust rankings
        if (word !== this.maxKeyValues[0].key) {
          // if word is not #2, then we can safely move #2 to #3 (otherwise we want #2 erased)
          if (word !== this.maxKeyValues[1].key) {
            let rank2 = this.maxKeyValues[1];
            this.maxKeyValues[2].update(rank2.key, rank2.value);
          }
          // we always shift #1 down
          let rank1 = this.maxKeyValues[0];
          this.maxKeyValues[1].update(rank1.key, rank1.value);
        }
        // update
        this.maxKeyValues[0].update(word, newValue);
      // if this new value is higher than #2
      } else if (newValue >= this.maxKeyValues[1].value) {
        // if word is not already #2, then readjust rankings
        if (word !== this.maxKeyValues[1].key) {
          let rank2 = this.maxKeyValues[1];
          this.maxKeyValues[2].update(rank2.key, rank2.value);
        }
        // update
        this.maxKeyValues[1].update(word, newValue);
      // if this new value is higher than #3
      } else if (newValue >= this.maxKeyValues[2].value) {
        this.maxKeyValues[2].update(word, newValue);
      }
    // if we don't already have this word stored
    } else {
      // store the word
      this.wordsAndCounts.set(word, 1);
      // change rankings if necessary
      for (let i = 0; i < this.maxKeyValues.length; i++) {
        if (this.maxKeyValues[i].key === null) {
          this.maxKeyValues[i].update(word, 1);
          break;
        }
      }
    }
    //this.printHighest();
    return true;
  }

  /*
    addWords
    words : String

    Attempt to add a string of words to the Map. Return true if any addition succeeds.
      Return false if no addition succeeds.
  */
  addWords(words) {
    let anyChange = false;
    words.split(' ').forEach(word => anyChange = this.addWord(word) || anyChange);
    return anyChange;
  }

  /*
    removeWord
    word : String

    Attempt to remove a word to the Map. Return true if removal succeeds.
      Return false is removal fails.
  */
  removeWord(word) {
    // sanitise
    word = this.sanitiseWord(word);
    if (word === '') {
      return false;
    }
    // if we already have the word, update count
    if (this.wordsAndCounts.has(word)) {
      // decrement count or remove word
      if (this.wordsAndCounts.get(word) === 1) {
        this.wordsAndCounts.delete(word);
      } else {
        this.wordsAndCounts.set(word, this.wordsAndCounts.get(word) - 1);
      }
      // update rankings
      if (this.wordsAndCounts.size === 0) {
        this.maxKeyValues[0].clear();
      } else {
        let newMaxPairs =
          [new KeyValuePair(), new KeyValuePair(), new KeyValuePair(),];
        // iterate through all word counts, update rankings
        for (let [key, value] of this.wordsAndCounts) {
          // #1
          if (newMaxPairs[0].key === null) {
            newMaxPairs[0].update(key, value);
          } else if (value > newMaxPairs[0].value) {
            // shift rankings
            let rank1 = newMaxPairs[0];
            let rank2 = newMaxPairs[1];
            newMaxPairs[2].update(rank2.key, rank2.value);
            newMaxPairs[1].update(rank1.key, rank1.value);
            // update
            newMaxPairs[0].update(key, value);
          // #2
          } else if (newMaxPairs[1].key === null) {
            newMaxPairs[1].update(key, value);
          } else if (value > newMaxPairs[1].value) {
            let rank2 = newMaxPairs[1];
            newMaxPairs[2].update(rank2.key, rank2.value);
            newMaxPairs[1].update(key, value);
          // #3
          } else if (newMaxPairs[2].key === null) {
            newMaxPairs[2].update(key, value);
          } else if (value > newMaxPairs[2].value) {
            newMaxPairs[2].update(key, value);
          }
        }
        // found new max
        for (let i = 0; i < this.maxKeyValues.length; i++) {
          this.maxKeyValues[i].update(newMaxPairs[i].key, newMaxPairs[i].value);
        }
        //this.printHighest();
      }
      return true;
    } else {
      return false;
    }
  }

  /*
    removeWords
    words : String

    Attempt to remove a string of words to the Map. Return true if any removal succeeds.
      Return false if no removal succeeds.
  */
  removeWords(words) {
    let anyChange = false;
    words.split(' ').forEach(word => anyChange = this.removeWord(word) || anyChange);
    return anyChange;
  }

  /*
    printHighest

    Debug function that prints the rankings to the console.
  */
  printHighest() {
    console.log('#1: \'' + this.maxKeyValues[0].key + '\' = ' + this.maxKeyValues[0].value);
    console.log('#2: \'' + this.maxKeyValues[1].key + '\' = ' + this.maxKeyValues[1].value);
    console.log('#3: \'' + this.maxKeyValues[2].key + '\' = ' + this.maxKeyValues[2].value);
  }
}

/*
  ViewQuoteStats

  Visually represent and modify the representation created by QuoteStats.
*/
class ViewQuoteStats {
  constructor() {
    this.quoteStats = new QuoteStats();
    // DOM elements
    this.quotesDiv = document.querySelector('.quote-rankings .quotes');
    this.rankings = document.querySelectorAll('.quote-rankings .rankings p');
    // add quote when Add Quote button clicked
    let addButton = document.querySelector('.quote-rankings form .add-quote-btn');
    let addTextBox = document.querySelector('.quote-rankings form .quote-input');
    addButton.addEventListener('click', () => {
      this.addQuote(addTextBox.value);
      addTextBox.value = '';
    });
    // disable default submit action of Add Quote button (so no redirect)
    let addQuoteForm = document.querySelector('.quote-rankings form');
    addQuoteForm.addEventListener('submit', e => {
      e.preventDefault();
    });
  }

  /*
    visualKey
    pair : KeyValuePair

    Controls visual representation of undefined (null) keys in KeyValuePairs.
  */
  visualKey(pair) {
    return pair.key === null ? 'n/a' : pair.key;
  }

  /*
    updateRankings

    Visually update the rankings.
  */
  updateRankings() {
    let wordRankings = this.quoteStats.maxKeyValues;
    for (let i = 0; i < wordRankings.length; i++) {
      let numberRank = '<span>#' + (i+1) + '</span>';
      this.rankings[i].innerHTML = numberRank + this.visualKey(wordRankings[i]);
    }
  }

  /*
    addQuote
    quote : String

    Visually add a quote and provoke logical changes.
  */
  addQuote(quote) {
    // add logically
    if (this.quoteStats.addWords(quote)) {
      // Then add the quote visually...
      // article element
      const newArticle = document.createElement('article');
      newArticle.setAttribute('class', 'quote');
      // p element
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(quote));
      newArticle.appendChild(p);
      // delete button
      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('type', 'button');
      // delete button event - remove all words in quote
      let removeQuote = function() {
        if (this.quoteStats.removeWords(p.innerHTML)) {
          deleteButton.removeEventListener('click', removeQuote);
          newArticle.remove(); // remove from DOM
          this.updateRankings();
        }
      }.bind(this);
      deleteButton.addEventListener('click', removeQuote);
      newArticle.appendChild(deleteButton);
      // add new quote to page
      this.quotesDiv.appendChild(newArticle);
      this.updateRankings();
    } else {
      window.alert('Please enter a valid quote')
    }
  }
}

let viewQuoteStats = new ViewQuoteStats();

// add some quotes for show
viewQuoteStats.addQuote('"It is by going down into the abyss that we recover the treasures of life. Where you stumble, there lies your treasure."');
viewQuoteStats.addQuote('If you have writer\'s block, switch from the goal of writing something good, to the goal of proving how bad you are.');
viewQuoteStats.addQuote('"If you cannot solve the proposed problem try to solve first some related problem."');
