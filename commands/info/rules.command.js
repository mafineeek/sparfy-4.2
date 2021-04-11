const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "zasady",
	aliases: ["rules"],
	run: async ({ msg }) => {
		const template = [
			"1: Kanał do reklam musi być tylko dla Sparfy",
			"2: Serwer nie może łamać ToS discorda",
			"3: Nazwa serwera nie może być typu \"Generator kont\", \"Invite = Nagroda\" etc.",
			"4: Treść reklamy nie może naruszać wartości etnicznicznych i rasistowskich oraz ma być przejrzysta, schludna (2137 emotek to nie schludność)",
			"5: Bot nie może posiadać wulgarnego pseudonimu",
			"6: Reklama nie może zawierać skróconych linków do serwera zaproszenia bota etc. (dozwolone custom linki sparfy.net)",
			"7: Serwer musi być zabezpieczony oraz ładnie zrobiony",
			"8: Serwer musi posiadać więcej niż 5 osób (boty się nie liczą)",
			"9: W przypadku edycji kanału w sposób zabroniony reklama może zostać skasowana z kolejki",
			"10: Reklama może zostać odrzucona za coś czego nie ma w zasadach reklamowania"
		].join("\n")

		const embed = new MessageEmbed()
			.setAuthor("Zasady Reklamowania Sparfy.net", Sparfy.user.displayAvatarURL())
			.setColor(Sparfy.config.main)
			.setDescription(`\`\`\`yaml\n${template}\`\`\``)
			.setFooter(`Wykonano dla ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true }))
		msg.channel.send(embed);
	}
}