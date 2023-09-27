declare module 'myTypes' {
    interface dataProps{
            "dueTodayPile": string,
            "dueYesterdayPile": string,
            "dueLaterPile": string,
            "notYetSeenPile": string,
            "dueDateRow": number
    }
  }
  
  module.exports = {
    flashCardProps,
    dataProps
  };