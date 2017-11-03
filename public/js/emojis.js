/* eslint-disable no-undef */
$(document).ready(() => {
  $(this).on('submit', (e) => {
    e.preventDefault();
  });
  const emoji = $('#chatInput').emojioneArea({
    hidePickerOnBlur: true,
    events: {
      keyup: (editor, event) => {
        if (event.which === 13) {
          $('.chat-box__form').scope().content = emoji.data('emojioneArea').getText();
          emoji.data('emojioneArea').setText('');
          $('.chat-box__form').submit();
          return false;
        }
      }
    }
  });
});
