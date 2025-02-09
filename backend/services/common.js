import passport from "passport"
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// Emails 
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "spevekar4@gmail.com",
    pass: process.env.MAIL_PASSWORD,
    // pass: "wbjh fdbp enwu lzif",
  },
});

export const isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
  // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OThiZDM5MTc3ZGRiZDRjM2U3NzZhMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MTQ2Njg0fQ.YMB70mWyP6QI0K58-v1ZuAKN8u4JsyPJ6-dT19lNxnY"


  // admin token
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGNjYjlhYzY3YWJkOWYwZGNmNWYwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNzgwMDE4MH0.8f19SaRclkMHvIQDgwRBGAslS9TkXECrRtPyNruiikY"
  return token;
};


// send mail with defined transport object
export const sendMail = async function({to, subject, text, html}){

  let info = await transporter.sendMail({
    from: '"Ecommerce 👻" <samipevekar24@gmail.com>', // sender address
    to,
    subject,
    text,
    html
  });

  return info
}
export const invoiceTemplate = function(order){

  return (`<!DOCTYPE html>
 <html>
 <head>
 
   <meta charset="utf-8">
   <meta http-equiv="x-ua-compatible" content="ie=edge">
   <title>Email Receipt</title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <style type="text/css">
   /**
    * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
    */
   @media screen {
     @font-face {
       font-family: 'Source Sans Pro';
       font-style: normal;
       font-weight: 400;
       src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
     }
 
     @font-face {
       font-family: 'Source Sans Pro';
       font-style: normal;
       font-weight: 700;
       src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
     }
   }
 
   /**
    * Avoid browser level font resizing.
    * 1. Windows Mobile
    * 2. iOS / OSX
    */
   body,
   table,
   td,
   a {
     -ms-text-size-adjust: 100%; /* 1 */
     -webkit-text-size-adjust: 100%; /* 2 */
   }
 
   /**
    * Remove extra space added to tables and cells in Outlook.
    */
   table,
   td {
     mso-table-rspace: 0pt;
     mso-table-lspace: 0pt;
   }
 
   /**
    * Better fluid images in Internet Explorer.
    */
   img {
     -ms-interpolation-mode: bicubic;
   }
 
   /**
    * Remove blue links for iOS devices.
    */
   a[x-apple-data-detectors] {
     font-family: inherit !important;
     font-size: inherit !important;
     font-weight: inherit !important;
     line-height: inherit !important;
     color: inherit !important;
     text-decoration: none !important;
   }
 
   /**
    * Fix centering issues in Android 4.4.
    */
   div[style*="margin: 16px 0;"] {
     margin: 0 !important;
   }
 
   body {
     width: 100% !important;
     height: 100% !important;
     padding: 0 !important;
     margin: 0 !important;
     background-color: #ffffff !important; /* Set background to white */
   }
 
   /**
    * Collapse table borders to avoid space between cells.
    */
   table {
     border-collapse: collapse !important;
   }
 
   a {
     color: #1a82e2;
   }
 
   img {
     height: auto;
     line-height: 100%;
     text-decoration: none;
     border: 0;
     outline: none;
   }
   </style>
 
 </head>
 <body style="background-color: #ffffff;">
 
   <!-- start preheader -->
   <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
     A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
   </div>
   <!-- end preheader -->
 
   <!-- start body -->
   <table border="0" cellpadding="0" cellspacing="0" width="100%">
 
     <!-- start logo -->
     <tr>
       <td align="center" bgcolor="#ffffff">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="center" valign="top" style="padding: 36px 24px;">
               <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                 <img src="https://e-commerce-sami.vercel.app/ecommerce.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
               </a>
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end logo -->
 
     <!-- start hero -->
     <tr>
       <td align="center" bgcolor="#ffffff">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #000000;">
               <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color: #000000;">Thank you for your order!</h1>
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end hero -->
 
     <!-- start copy block -->
     <tr>
       <td align="center" bgcolor="#ffffff">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
 
           <!-- start copy -->
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000000;">
               <p style="margin: 0;">Here is a summary of your recent order. If you have any questions or concerns about your order, please <a href="spevekar4@gmail.com">contact us</a>.</p>
             </td>
           </tr>
           <!-- end copy -->
 
           <!-- start receipt table -->
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
               <table border="0" cellpadding="0" cellspacing="0" width="100%">
                 <tr>
                   <td align="left" bgcolor="#000000" width="60%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #ffffff;"><strong>Order #</strong></td>
                   <td align="left" bgcolor="#000000" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #ffffff;"><strong>Qty</strong></td>
                   <td align="left" bgcolor="#000000" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #ffffff;"><strong>Price</strong></td>
                 </tr>
                 ${order.items.map(item=>`<tr>
                   <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000000;">${item.product.title}</td>
                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000000;">${item.quantity}</td>
                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000000;">$${Math.round(item.product.price*(1-item.product.discountPercentage/100),2)}</td>
                 </tr>`)
 
                 }
                
                
                 <tr>
                   <td align="left" width="60%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #000000; border-bottom: 2px dashed #000000; color: #000000;"><strong>Total</strong></td>
                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #000000; border-bottom: 2px dashed #000000; color: #000000;"><strong>${order.totalItems}</strong></td>
                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #000000; border-bottom: 2px dashed #000000; color: #000000;"><strong>$${order.totalAmount}</strong></td>
                 </tr>
               </table>
             </td>
           </tr>
           <!-- end reeipt table -->
 
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end copy block -->
 
     <!-- start receipt address block -->
     <tr>
       <td align="center" bgcolor="#ffffff" valign="top" width="100%">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="left" valign="top" style="font-size: 0; border-bottom: 3px solid #000000">
               <!--[if (gte mso 9)|(IE)]>
               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
               <tr>
               <td align="left" valign="top" width="300">
               <![endif]-->
               <div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;">
                 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
                   <tr>
                     <td align="left" valign="top" style="padding-bottom: 36px; padding-left: 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000000;">
                       <p><strong>Delivery Address</strong></p>
                       <p>${order.selectedAddress.name}<br>${order.selectedAddress.street}<br>${order.selectedAddress.city},${order.selectedAddress.state},${order.selectedAddress.pinCode}</p>
                       <p>${order.selectedAddress.phone}</p>
 
                       </td>
                   </tr>
                 </table>
               </div>
               <!--[if (gte mso 9)|(IE)]>
               </td>
               <td align="left" valign="top" width="300">
               <![endif]-->
             
               <!--[if (gte mso 9)|(IE)]>
               </td>
               </tr>
               </table>
               <![endif]-->
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end receipt address block -->
 
   </table>
   <!-- end body -->
 
 </body>
 </html>`
  )
 
 
 }