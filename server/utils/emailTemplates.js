/**
 * 生成高端的欢迎邮件 HTML
 * @param {string} username - 用户的用户名
 * @returns {string} 完整的 HTML 字符串
 */
export const getWelcomeEmailHtml = (username) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>欢迎加入传媒生作品集助手</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- 主体卡片 -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); overflow: hidden;">
          
          <!-- 顶部 Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: left; border-bottom: 1px solid #f0f0f0;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #111111; letter-spacing: -0.5px;">✨ Portfolio Assistant</h1>
            </td>
          </tr>

          <!-- 内容区 -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 500; color: #111111;">
                Hi, ${username}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #555555;">
                非常高兴能与你相遇。欢迎加入<strong>传媒生作品集助手</strong>，这是你专属的作品管理与智能优化空间。
              </p>
              
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111111;">在这里，你可以轻松实现：</p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>将零散的项目素材结构化、系统化管理</li>
                  <li>使用 AI 深度润色项目描述，提升专业感</li>
                  <li>一键提炼面试讲述话术，从容应对求职</li>
                </ul>
              </div>

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://xianglun515.github.io/files-tool" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500; letter-spacing: 0.5px;">
                      前往体验全新首页
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 底部 Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; text-align: center; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">
                此致,<br>
                传媒生作品集助手 团队
              </p>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #bbbbbb;">
                这是一封系统自动发送的邮件，请勿直接回复。
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
