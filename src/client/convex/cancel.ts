// /**
//  * 凸報告にリアクションをつける。
//  * 取り消しの処理も行う
//  * @param before 取り消す前の値
//  * @param msg DiscordからのMessage
//  */
// const reaction = (before: string, msg: Discord.Message) => {
//   // ❌スタンプを押した際にデータの取り消しを行う
//   msg.awaitReactions((react, user) => {
//     ;(async () => {
//       // 送信者が❌スタンプ押した場合以外は終了
//       if (user.id !== msg.author.id || react.emoji.name !== '❌') return

//       // データの更新を行う
//       const after = await cellUpdate(before, msg)
//       msg.reply(`\`${after}\` を取り消したわ`)
//       console.log('Convex cancel')
//     })()
//     return true
//   })
// }
