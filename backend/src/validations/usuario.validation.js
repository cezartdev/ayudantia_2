import Joi from 'joi';

// El esquema de validacion se realizó segun la entidad User de 
// Entities

export const usuarioRegisterLogin = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'cl'] } })
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.email': 'El email debe tener un formato válido',
            'string.min': 'El email debe tener al menos 3 caracteres',
            'string.max': 'El email no puede exceder los 255 caracteres',
            'any.required': 'El email es requerido'
        }),
    password: Joi.string()
        .min(8)
        .max(255)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$'))
        .required()
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.max': 'La contraseña no puede exceder los 255 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número',
            'any.required': 'La contraseña es requerida'
        })
});

// hice otro esquema para la actualizacion de perfil, porque en este caso
// el usuario puede actualizar solo el email o solo la contraseña, o ambos
export const usuarioProfileUpdate = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu', 'gov', 'cl'] } })
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.email': 'El email debe tener un formato válido',
            'string.min': 'El email debe tener al menos 3 caracteres',
            'string.max': 'El email no puede exceder los 255 caracteres'
        }),
    password: Joi.string()
        .min(8)
        .max(255)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$'))
        .optional()
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.max': 'La contraseña no puede exceder los 255 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
        })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});