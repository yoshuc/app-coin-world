// Lesson questions — matches prototype QUESTIONS array exactly
export const QUESTIONS = [
  {
    scenario: 'piggy',
    es: {
      q: 'Tienes 10 monedas. Ves un dulce de 8. ¿Qué haces?',
      a: ['Lo compro ya', 'Ahorro 5 y compro luego', 'Lo dejo, no lo necesito'],
      correct: 1,
      why: 'Ahorrar primero te da más opciones después.',
    },
    en: {
      q: 'You have 10 coins. You see candy for 8. What do you do?',
      a: ['Buy it now', 'Save 5 and buy later', "Skip — I don't need it"],
      correct: 1,
      why: 'Saving first gives you more options later.',
    },
  },
  {
    scenario: 'jar',
    es: {
      q: '¿Qué es ahorrar?',
      a: ['Gastar rápido', 'Guardar para después', 'Esconderlo y olvidarlo'],
      correct: 1,
      why: 'Ahorrar es guardar para una meta.',
    },
    en: {
      q: 'What does "saving" mean?',
      a: ['Spending fast', 'Keeping it for later', 'Hiding and forgetting it'],
      correct: 1,
      why: 'Saving means keeping money for a goal.',
    },
  },
  {
    scenario: 'choice',
    es: {
      q: 'Tu meta es un libro de 20. Tienes 8. ¿Qué haces?',
      a: ['Compro otra cosa', 'Sigo ahorrando hasta 20', 'Pido prestado'],
      correct: 1,
      why: '¡Las metas se cumplen con paciencia!',
    },
    en: {
      q: 'Your goal is a 20-coin book. You have 8. What do you do?',
      a: ['Buy something else', 'Keep saving up to 20', 'Borrow from a friend'],
      correct: 1,
      why: 'Goals come true with patience!',
    },
  },
];
