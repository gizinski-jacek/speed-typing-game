import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputCheck',
})
export class InputCheckPipe implements PipeTransform {
  transform(
    quote: string,
    userInput: string
  ): { quote: string; input: string }[] {
    const wordsInQuote: string[] = quote.split(' ');
    const wordsInUserInput: string[] = userInput.split(' ');
    const checkedWords = wordsInUserInput.map((word, index, array) => {
      let html: string = '';
      if (word === wordsInQuote[index]) {
        html = `<span class="correct">${word}</span>`;
      } else {
        html = `<span class="wrong">${word}</span>`;
      }
      if (
        index === array.length - 1 &&
        array.length !== wordsInQuote[index].length
      ) {
        html = html + '<span class="custom-cursor"></span>';
      }
      return html;
    });
    const quoteLines: string[] = [];
    const userInputLines: string[] = [];
    for (let i = 0; i < wordsInQuote.length; i += 8) {
      const chunk = wordsInQuote.slice(i, i + 8).join(' ');
      quoteLines.push(chunk);
    }
    for (let i = 0; i < checkedWords.length; i += 8) {
      const chunk = checkedWords.slice(i, i + 8).join(' ');
      userInputLines.push(chunk);
    }
    const quoteWordUserInputWordPair = quoteLines.map((word, index) => {
      return { quote: word, input: userInputLines[index] };
    });
    return quoteWordUserInputWordPair;
  }
}
