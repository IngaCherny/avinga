// Motivational quotes + celebration messages for the dashboard.
// A deterministic "pick of the day" keeps the same quote all day, then rotates.

export interface Quote {
  text: string
  by?: string
}

/** A generous pool — one is featured each day on the Today dashboard. */
export const QUOTES: Quote[] = [
  { text: 'Consistency over perfection — you’ve got this.' },
  { text: 'You don’t have to be extreme, just consistent.' },
  { text: 'Discipline is choosing between what you want now and what you want most.' },
  { text: 'The only bad workout is the one that didn’t happen.' },
  { text: 'Strong is a feeling, not a size.' },
  { text: 'Take care of your body. It’s the only place you have to live.', by: 'Jim Rohn' },
  { text: 'A little progress each day adds up to big results.' },
  { text: 'Sweat is just fat crying.' },
  { text: 'Your body can stand almost anything. It’s your mind you have to convince.' },
  { text: 'Fall in love with taking care of yourself.' },
  { text: 'Show up for yourself today.' },
  { text: 'The hardest lift of all is lifting your butt off the couch.' },
  { text: 'Motivation gets you started. Habit keeps you going.', by: 'Jim Ryun' },
  { text: 'Don’t wish for it, work for it.' },
  { text: 'You’re one workout away from a good mood.' },
  { text: 'Progress, not perfection.' },
  { text: 'Push yourself, because no one else is going to do it for you.' },
  { text: 'Energy and persistence conquer all things.', by: 'Benjamin Franklin' },
  { text: 'Well done is better than well said.', by: 'Benjamin Franklin' },
  { text: 'It never gets easier, you just get stronger.' },
  { text: 'Wake up with determination, go to bed with satisfaction.' },
  { text: 'Little by little, a little becomes a lot.' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', by: 'Robert Collier' },
  { text: 'Do something today that your future self will thank you for.' },
  { text: 'The body achieves what the mind believes.' },
  { text: 'Train like a beast, look like a beauty.' },
  { text: 'You are far more capable than you think.' },
  { text: 'Slow progress is still progress.' },
  { text: 'A year from now you’ll wish you had started today.', by: 'Karen Lamb' },
  { text: 'Be stronger than your strongest excuse.' },
  { text: 'Sore today, strong tomorrow.' },
  { text: 'Don’t count the days, make the days count.', by: 'Muhammad Ali' },
  { text: 'Hard work beats talent when talent doesn’t work hard.' },
  { text: 'Believe you can and you’re halfway there.', by: 'Theodore Roosevelt' },
  { text: 'It always seems impossible until it’s done.', by: 'Nelson Mandela' },
  { text: 'Move your body, clear your mind.' },
  { text: 'The pain you feel today will be the strength you feel tomorrow.' },
  { text: 'Good things come to those who sweat.' },
  { text: 'Every workout is progress, no matter how small.' },
  { text: 'You didn’t come this far to only come this far.' },
  { text: 'Make yourself proud.' },
  { text: 'Rest when you’re weary. Refresh and renew yourself. Then get back to it.' },
  { text: 'A goal without a plan is just a wish.', by: 'Antoine de Saint-Exupéry' },
  { text: 'Strive for progress, not perfection.' },
  { text: 'Your only limit is you.' },
  { text: 'Some days you won’t feel like it — do it anyway, gently.' },
  { text: 'Be proud of every step you take toward reaching your goal.' },
  { text: 'The secret of getting ahead is getting started.', by: 'Mark Twain' },
  { text: 'You’re allowed to be both a masterpiece and a work in progress.' },
  { text: 'Small steps every day.' },
  { text: 'Doing your best is more important than being the best.' },
  { text: 'Falling down is how we grow. Staying down is how we die.' },
  { text: 'Strong women lift each other up — and a few dumbbells too.' },
  { text: 'Your future is created by what you do today, not tomorrow.' },
  { text: 'One day or day one. You decide.' },
  { text: 'Be the energy you want to attract.' },
  { text: 'Discipline is the bridge between goals and accomplishment.', by: 'Jim Rohn' },
  { text: 'Nothing will work unless you do.', by: 'Maya Angelou' },
  { text: 'You’ve survived 100% of your hardest days. Keep going.' },
]

/** Many ways to celebrate a finished workout — one is chosen per day. */
export const DONE_CHEERS: string[] = [
  'Done — amazing work! ♡',
  'Crushed it. So proud of you! ✨',
  'Yes! Another one in the books. 💪',
  'Look at you go — incredible! ♡',
  'Workout complete. You’re unstoppable!',
  'That’s how it’s done. Bravo! 🌟',
  'Sweaty and strong — love to see it!',
  'Boom. Future you says thank you. ♡',
  'Nailed it. Consistency queen! 👑',
  'One step stronger today. Beautiful work!',
  'You showed up and showed off. ✨',
  'Done & dusted — go you!',
  'Strong body, happy mind. Great job! ♡',
  'Checked off and glowing. 🔥',
  'Proud of you — that took grit!',
  'Another win for the streak! ⚡',
  'You did the thing! Celebrate it. 🎉',
  'Effort = everything. Well done!',
  'That’s a yes from your future self. ♡',
  'Sweat earned, smile deserved. 😊',
]

/** Stable hash of a YYYY-MM-DD string. */
function hashDate(iso: string): number {
  let h = 0
  for (let i = 0; i < iso.length; i++) {
    h = (h * 31 + iso.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Deterministically pick an item for a given date — same all day, rotates
 * daily. `salt` lets different lists pick independently for the same date.
 */
export function pickByDate<T>(list: T[], iso: string, salt = 0): T {
  return list[(hashDate(iso) + salt) % list.length]
}
