import Email from './ultils/email.mjs';

let user = {
    email: 'khoa12356@mailsac.com',
    name: 'dang trung',
};
new Email(user, 'https://www.youtube.com/watch?v=lBRnLXwjLw0').sendWelcome();
