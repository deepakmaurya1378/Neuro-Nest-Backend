import jwt from "jsonwebtoken"
export const generateToken = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 1000, // MS
        httpOnly: true, // prevent xxs attacks cross-site scripting attacks
        sameSite: "strict", // csrf attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !=="development"  // if we are not in development mode we should use secure

    })
}