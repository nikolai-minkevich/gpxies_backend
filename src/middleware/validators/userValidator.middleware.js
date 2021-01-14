const { body, check } = require('express-validator');
const Role = require('../../utils/userRoles.utils');


exports.createUserSchema = [
    check('username')
        .exists()
        .withMessage('Имя пользователя обязательно')
        .isLength({ min: 3 })
        .withMessage('Минимальная длина &mdash; 3 символа')
        .isAlphanumeric()
        .withMessage('Допускаются только латинские буквы и цифры'),
    check('email')
        .exists()
        .withMessage('Адрес почты обязателен')
        .isEmail()
        .withMessage('Введите корректный адрес')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.User])
        .withMessage('Неверная роль'),
    check('password')
        .exists()
        .withMessage('Пароль обязателен')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов'),
    check('confirm_password')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Пароли должны совпадать'),
];

exports.updateUserSchema = [
    check('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Минимальная длина &mdash; 3 символа')
        .isAlphanumeric()
        .withMessage('Допускаются только латинские буквы и цифры'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Введите корректный адрес')
        .normalizeEmail(),
    check('role')
        .optional()
        .isIn([Role.Admin, Role.User])
        .withMessage('Неверная роль'),
    check('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Необходимо ввести подтверждение пароля'),
    check('confirm_password')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Пароли должны совпадать'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.validateLogin = [
    check('email')
        .exists()
        .withMessage('Адрес почты обязателен')
        .isEmail()
        .withMessage('Введите корректный адрес')
        .normalizeEmail(),
    check('password')
        .exists()
        .withMessage('Пароль обязателен')
        .notEmpty()
        .withMessage('Пароль обязателен')
];