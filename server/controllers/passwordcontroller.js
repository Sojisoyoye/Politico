import pool from '../models/connect';
import Mailer from '../helpers/helperMailer';
import helperTemplate from '../helpers/helperTemplate';
import Helper from '../helpers/helperutils';

const { sendMail } = Mailer;
const passwordController = {
  /**
     * @method To send Password reset link
     * @param {object} req
     * @param {object} res
     * @returns {object} Json api response
     */
  async passwordReset(req, res) {
    let info;

    try {
      const { email } = req.body;
      const token = Helper.genrateToken(email);
      const url = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${token}`;
      const message = helperTemplate.confirmRequestPage(url);
      const subject = 'Reset Password';
      info = await sendMail({ to: email, subject, html: message });
      const { accepted } = info;
      if (accepted[0] === email) {
        res.status(200).json({
          status: 200,
          message: 'Kindly check your email for further instruction to reset your password',
          email,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 500,
        err,
        info,
      });
    }
  },


  /**
     * @method to generate password reset form
     * @param {object} req
     * @param {object} res
     * @returns {html} html page
     */
  async passwordResetForm(req, res) {
    const { token } = req.params;
    try {
      const decode = Helper.verifyToken(token);
      const { userId } = decode;
      if (!decode) {
        res.send(helperTemplate.errorPage('This token is Invalid'));
      }
      res.send(helperTemplate.passwordResetFormPage(userId));
    } catch (err) {
      res.send(helperTemplate.errorPage('This token is Invalid'));
    }
  },


  /**
     * @method to send formdata to password reset endpoint
     * @param {object} req
     * @param {object} res
     * @returns {html} html page
     */
  async resetPassword(req, res) {
    const { email, password, confirmpassword } = req.body;
    if (!password || password.length < 6) {
      res.send(helperTemplate.passwordResetFormPage(email, '<div class="info">Password must be more than 6 characters</div>'));
    } else if (password !== confirmpassword) {
      res.send(helperTemplate.passwordResetFormPage(email, '<div class="info">Password does not match</div>'));
    } else {
      const hashPassword = Helper.hashPassword(password);
      const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
      const values = [
        hashPassword,
        email,
      ];

      try {
        const update = await pool.query(updateQuery, values);
        if (update.rowCount) {
          const url = 'signin.html';
          res.send(helperTemplate.successPage('Password reset succuessful', `<a href="${url}">Click to Login</a>`));
        } else {
          res.send(helperTemplate.passwordResetFormPage(email, '<div class="info">Can not reset password, please try again</div>'));
        }
      } catch (err) {
        res.send(helperTemplate.passwordResetFormPage(email, '<div class="info">Can not reset password, please try again</div>'));
      }
    }
  },
};


export default passwordController;
