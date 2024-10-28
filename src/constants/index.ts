export const TYPES = {
   AuthService: Symbol.for('AuthService'),
   AuthRepository: Symbol.for('AuthRepository'),
   AuthController: Symbol.for('AuthController'),
   Logger: Symbol.for('Logger'),
   JWTService: Symbol.for('JWTService'),
};

export const Roles = {
   CUSTOMER: 'customer',
   ADMIN: 'admin',
   MANAGER: 'manager',
} as const;
