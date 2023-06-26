declare module 'myTypes' {
    interface dataProps{
        "newPile": string,
            "seenPile": string,
            numAttempts: number,
            numWordsSeen: number,
            numCorrect: number
    }
  }
  
  module.exports = {
    flashCardProps,
    dataProps
  };