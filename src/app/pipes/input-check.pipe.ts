import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputCheck',
})
export class InputCheckPipe implements PipeTransform {
  transform(
    quote: string,
    userInput: string,
    gameStarted: boolean
  ): { quote: string; input: string }[] {
    // Splitting quote and user input into words arrays.
    const wordsInQuote: string[] = quote.split(' ');
    const wordsInUserInput: string[] = userInput.split(' ');
    // Checking user input words against quote words and applying "correct"
    // or "wrong" class for styling purposes.
    const checkedWords = wordsInUserInput.map((word, index, array) => {
      let html: string = '';
      if (!array[0]) {
        return '<span class="custom-cursor"></span>';
      }
      if (!wordsInQuote[index]) {
        return;
      }
      if (word === wordsInQuote[index]) {
        html = `<span class="correct">${word}</span>`;
      } else {
        html = `<span class="wrong">${word}</span>`;
      }
      if (index === array.length - 1) {
        html = html + '<span class="custom-cursor"></span>';
      }
      return html;
    });
    // Marking current word to repeat if games has started.
    const wordsInQuoteWithMarkedCurrentWord = gameStarted
      ? wordsInQuote.map((word, i) =>
          i === wordsInUserInput.length - 1
            ? `<span class="current-word">${word}</span>`
            : word
        )
      : wordsInQuote;
    // Splitting words into 8 word long lines.
    const quoteLines: string[] = [];
    for (let i = 0; i < wordsInQuoteWithMarkedCurrentWord.length; i += 8) {
      const chunk = wordsInQuoteWithMarkedCurrentWord.slice(i, i + 8).join(' ');
      quoteLines.push(chunk);
    }
    const userInputLines: string[] = [];
    for (let i = 0; i < checkedWords.length; i += 8) {
      const chunk = checkedWords.slice(i, i + 8).join(' ');
      userInputLines.push(chunk);
    }
    // Hiding all lines except for the first one. Revealing next
    // line when user types in enough words of current line.
    const visibleQuoteLines = quoteLines.map((line, index, array) =>
      index === 0
        ? line
        : userInputLines[index - 1]?.split(/(?!span) (?!class)/gm).length >=
          array[index - 1]?.split(/(?!span) (?!class)/gm).length - 1
        ? line
        : `<span class="line-hidden">${line}</span>`
    );
    const quoteWordUserInputWordPair = visibleQuoteLines.map((line, index) => {
      return { quote: line, input: userInputLines[index] };
    });
    return quoteWordUserInputWordPair;
  }
}
