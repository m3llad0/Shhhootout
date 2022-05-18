import bcrypt from 'bcrypt'

const specialCharRegex = /[~`!#$%^&*+=-\[\]\\\';,\/{}|\":<>?]/;


export const hashPassword = async (password : string, saltRounds: number = 10) : Promise<string | null> => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt) ;
    } catch (error) {
        console.error(error);
    }

    // Return null if error
    return null;
};


export const verifyPassword = async (password : string, hash: string) : Promise<boolean> => {
    try {
        return await bcrypt.compareSync(password, hash)
    } catch (error) {
        console.error(error)
    }

    return false
}

export const isStrongPassword = (password : string) : boolean => {
    if (password.length < 10) {
        return false
    }

    let hasNumber = false
    let hasSpecial = false

    for (let c of password) {
        if (c >= '0' && c <= '9' && !hasNumber) {
            hasNumber = true
        }
        else if (specialCharRegex.test(c) && !hasSpecial) {
            hasSpecial = true
        }
        else if (hasNumber && hasSpecial) {
            return true
        }
    }

    return false
}