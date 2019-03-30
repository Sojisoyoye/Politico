class htmlHelperTemplate {
  static confirmRequestPage(url) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans|Pacifico" rel="stylesheet">
          <title>Politico | Password Reset</title>
          <style>
            * {
              box-sizing: border-box;
            }
          html, body{
            height: 100%;
          }
          body {
            padding: 0;
            margin: 0;
          }
          
          .container {
            flex-direction: column;
            height:80%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
           .header_logo {
              height: 32px;
              padding-top: 9px;
              font-size: 1.3rem
            } 
            .header_outside {
                margin: 0 auto;
                text-decoration: none;
            }
            
            .header_container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 25px;
                background: #fff;
                width: 100%;
                min-height: 62px;
                height: 62px;
            }
          
          .reset_link {
            background: #42a5f5;
            border-radius: 6px;
            border: none;
            outline: none;
            color: #000;
            font-size: 0.8rem;
            cursor: pointer;
            opacity: 0.8;
            padding: 0.8rem;
            width: 10rem;
            text-align: center;
            font-size: 1.2rem;
            text-decoration: none;
          }
          .reset_link:hover {
            opacity: 1;
          } 

          a {
              text-decoration: none;
              color:#000;
          }

          h1 {
            font-family: 'Pacifico', cursive;
          }

          p {
            font-size: 1.2rem;
          }
          </style>
        </head>
        <body>
            <div class="header_container">
                <div class="header_outside">
                    <a href="index.html">
                        <div class="header_logo">
                            <h1>Politico</h1>
                        </div>
                    </a>
                </div>
            </div>
          <div class="container">
              <h1>Reset Password</h1>
               <p>You requested for a password reset of your account</p>
              <p>If this is you, Click the button below to proceed</p><br>
              <a class="reset_link" href="${url}">Reset Password</a> 
          </div>
        </body>
        </html>`;
  }

  static passwordResetFormPage(email = '', error = '') {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans|Pacifico" rel="stylesheet">
      <title>Politco | Password Reset</title>
      <style>
        * {
          box-sizing: border-box;
        } 
      html, body{
        height: 100%;
      }
      body {
        padding: 0;
        margin: 0;
      }
      a {
          text-decoration: none;
          color:#000;
      }

      h1 {
        font-family: 'Pacifico', cursive;
        width: 100%;
        height: 100%;
        font-size: 40px;
      }
      
      .app_header_logo {
        height: 32px;
        padding-top: 9px;
      }
      
      .app_header_container {
        display: flex;
        justify-content: flex-start;
        margin-top: 25px;
        margin-bottom: 80px;
        background: #fff;
        width: 100%;
        min-height: 50px;
        height: 50px;
      }
      
      .app_header_outside {
        margin: 0 auto;
      }
      
      .app_media_container {
        font-family: Open Sans, Helvetica, Arial, EmojiFontFace, sans-serif;
      } 
      
      .app_content_container {
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 24px;
        max-width: 510px;
      }
          
      .app_info_message {
        font-size: 22px;
        letter-spacing: 0.5px;
        min-height: 50px;
        font-weight: 300;
        text-align: center;
        width: auto;
        margin-top: 8px;
        margin-left: auto;
        margin-right: auto;
        color: #444;
      }

      .TabContainer {
        max-width: 380px;
        display: flex;
        flex-direction: column;
        margin-top: 24px;
        margin-left: auto;
        margin-right: auto;
      }

      .TabContainer__tab--basic {
        border-top-left-radius: 2px;
        box-shadow: inset 8px 4px 0 #fff;
      }

      .TabContainer__form {
        flex-grow: 1;
        box-shadow: 0 0 2px #fff, 0 0 5px #888;
        padding: 16px 32px;
        min-height: 304px;
      }
      
      .app_form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .app_input_outer {
        width: 100%;
      } 
          
      .app_label_text {
        font-weight: 300;
        text-align: left;
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin: 20px 0 8px 0;
      }

      .app_input {
        width: 100%;
        font-size: 14px;
        font-weight: 300;
        padding: 11px;
        background-color: #FAFAFA;
        border-radius: 2px;
        margin-bottom: 7px;
        border-style: solid;
        border-width: 1px;
        border-color: #DCDCDC;
      }

      .app_reset_button {
        width: 100%;
        margin-top: 28px;
        margin-bottom: 16px;
        font-size: 16px;
        color: #212121;
        background-color: #42a5f5;
        height: 40px;
        border-radius: 5px;
      }

      .info {
        padding: 10px;
        text-align: center;
        width: 250px;
        background: #ff0000;
        color: #fff;
        font-style: bold;
        overflow-wrap: break-word;
      }

      @media screen and (min-width: 768px) {
         .info {
          width: 350px;
        }
      }
      </style>
    </head>
    <body>
        <div>
            <div>
                <div class="app_layout">
                    <div class="app_layout_content">
                       <div class="app_header_container"> 
                            <div class="app_header_outside">
                                <a href="index.html">
                                    <div class="app_header_logo">
                                        <h1>Politico</h1>
                                    </div>
                                </a>
                            </div>
                        </div> 
                        <div class="app_media_container">
                        <div class="app_content_container">
                            <h1 class="app_info_message">Reset your password</h1>
                            <div class="TabContainer TabContainer--basic">
                                <div class="TabContainer__form">
                                    <form class="app_form" action="/api/v1/password/reset" method="post">
                                        <p style="font-size: 18px;">Enter your new password</p>
                                        ${error}
                                        <div class="app_input_outer">
                                            <label>
                                                <div class="app_label_text">
                                                    <span>Password</span>
                                                </div>
                                                <input type="password" name="password" class="app_input" required>
                                            </label>
                                        </div>
                                        <div class="app_input_outer">
                                            <label>
                                                <div class="app_label_text">
                                                    <span>Confrim Password</span>
                                                </div>
                                                <input type="password" name="confirmpassword" class="app_input" required>
                                            </label>
                                        </div>
                                        <input type="hidden" name="email" value="${email}">
                                        <input type="submit" class="app_reset_button" value="Reset Password">
                                      </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
  }

  static errorPage(error) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Politico | Password Reset</title>
      <style>
        * {
          box-sizing: border-box;
        }
      html, body{
        height: 100%;
      }
      body {
        padding: 0;
        margin: 0;
      }
      
      .error_container {
        border: 1px solid #fff;;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .error {
        width: 250px;
        border-radius: 6px;
        overflow-wrap: break-word;
        background: #ff0000;
        color: #fff;
        font-size: 18px;
        text-align: center;
        padding: 20px 0;
      }
      @media screen and (min-width: 768px) {
        .error {
          width: 300px;
        }
      }
      </style>
    </head>
    <body>
      <div class="error_container">
        <div class="error">${error}</div>
      </div>
    </body>
    </html>`;
  }

  static successPage(successMsg, url = '') {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>POLITICO</title>
      <style>
        * {
          box-sizing: border-box;
        }
      html, body{
        height: 100vh;
      }
      body {
        padding: 0;
        margin: 0;
      }
      
      .success_container {
        border: 1px solid #fff;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .success {
        width: 250px;
        border-radius: 6px;
        overflow-wrap: break-word;
        background: #00B32C;
        color: #fff;
        font-size: 18px;
        text-align: center;
        padding: 40px 10px;
      }
      a {
        background: #42a5f5;
        border: none;
        border-radius: 5px;
        outline: none;
        color: #212121;
        font-size: 0.8rem;
        cursor: pointer;
        opacity: 0.8;
        padding: 0.8rem;
        width: 10rem;
        text-align: center;
        font-size: 1rem;
        margin-top: 15px;
      }
      a:hover {
        opacity: 1;
      }
      @media screen and (min-width: 768px) {
        .success {
          width: 300px;
        }
      }
      </style>
    </head>
    <body>
      <div class="success_container">
        <div class="success">${successMsg}</div>
        ${url}
      </div>
    </body>
    </html>`;
  }
}

export default htmlHelperTemplate;
