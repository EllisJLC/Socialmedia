import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => { //promise takes callback as an argument
        bcrypt.genSalt(12, (error, salt) => { // str of 8/12/16, increasingly improves strength of incryption and increases pwoer usage
            if(error) {
                reject(error);
            }
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    reject (error);
                }
                resolve(hash);
            });
        });
    }); 
}; 

export const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
};