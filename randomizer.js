function populateChoices(values_, weights_) {
    let filledArray = [];
    for (var i = 0; i < values_.length; i++) {
      for (var j = 0; j < weights_[i]; j++) {
        filledArray.push(values_[i]);
      }
    }
    return filledArray;
  }
  
  function choose(values_, weights_) {
    let choices = populateChoices(values_, weights_);
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

module.exports = {
    populateChoices,
    choose,
};