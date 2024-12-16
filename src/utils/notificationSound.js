export const playNotificationSound = () => {
  const audio = new Audio('/mixkit-correct-answer-tone-2870.wav');
  audio.play().catch(error => {
    console.error('Error playing notification sound:', error);
  });
}; 