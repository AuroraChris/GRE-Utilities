var mongoose = require("mongoose");
var comments = require("./comments")

mongoose.connect("mongodb://localhost/dictionary");

var words = [
    { English: "abstemious", Chinese: "（吃喝等）有节制的，节俭的", Synonym: "continent", Antonym: "indulgent", Wordlist: false},
    { English: "adventitious", Chinese: "外来的，后天的", Synonym: "extraneous", Antonym: "constitutional", Wordlist: false},
    { English: "adversary", Chinese: "敌手，对手", Synonym: "antagonist", Antonym: "ally", Wordlist: false},
    { English: "arrhythmic", Chinese: "不规律的", Synonym: "disorderly", Antonym: "regular", Wordlist: false},
    { English: "assertive", Chinese: "武断的，强烈自信的", Synonym: "peremptory", Antonym: "diffident", Wordlist: false},
    { English: "abandon", Chinese: "放纵", Synonym: "unconstraint", Antonym: "constraint", Wordlist: false},
    { English: "abase", Chinese: "降低", Synonym: "debauch", Antonym: "elevate", Wordlist: false},
    { English: "abash", Chinese: "使尴尬，使羞愧", Synonym: "discountenance", Antonym: "embolden", Wordlist: false},
    { English: "abate", Chinese: "减轻（程度或者强度）", Synonym: "moderate", Antonym: "intensify", Wordlist: false},
    { English: "abbreviate", Chinese: "缩写，缩短", Synonym: " abridge", Antonym: "extend", Wordlist: false},
    { English: "abdicate", Chinese: "正式放弃（权力、责任）", Synonym: "cede", Antonym: "constitute", Wordlist: false},
    { English: "aberrant", Chinese: "异常的，非常规的", Synonym: "anomalous", Antonym: "standard", Wordlist: false},
    { English: "abeyance", Chinese: "中止，搁置", Synonym: "doldrums", Antonym: "continuance", Wordlist: false},
    { English: "abhor", Chinese: "深恶痛绝", Synonym: "abominate", Antonym: "admire", Wordlist: false},
    { English: "abiding", Chinese: "永久的", Synonym: "ageless", Antonym: "evanescent", Wordlist: false},
    { English: "abject", Chinese: "无精打采", Synonym: "spiritless", Antonym: "spirited", Wordlist: false},
    { English: "abjure", Chinese: "发誓放弃", Synonym: "renege", Antonym: "embrace", Wordlist: false},
    { English: "abnegate", Chinese: "否认", Synonym: "repudiate", Antonym: "reaffirm", Wordlist: false},
    { English: "abominate", Chinese: "憎恶", Synonym: "despise", Antonym: "esteem", Wordlist: false},
    { English: "abrade", Chinese: "磨损，精神上折磨", Synonym: "excoriate", Antonym: "augment", Wordlist: false},
    { English: "absolve", Chinese: "使无罪，解除责任", Synonym: "acquit", Antonym: "blame", Wordlist: false},
    { English: "abstain", Chinese: "自我克制，主动戒绝", Synonym: "forgo", Antonym: "succumb", Wordlist: false},
    { English: "abstract", Chinese: "使分心", Synonym: "detract", Antonym: "attention", Wordlist: false},
    { English: "abstruse", Chinese: "难以理解的", Synonym: "arcane", Antonym: "accessible", Wordlist: false},
    { English: "absurd", Chinese: "不合理", Synonym: "bizarre", Antonym: "sensible", Wordlist: false},
    { English: "abysmal", Chinese: "极低的或极可怜", Synonym: "bottomless", Antonym: "shallow", Wordlist: false},
    { English: "accede", Chinese: "赞成", Synonym: "acquiesce", Antonym: "dissent", Wordlist: false},
    { English: "accelerate", Chinese: "加速", Synonym: "escalate", Antonym: "retard", Wordlist: false},
    { English: "accessible", Chinese: "可以到达的", Synonym: "handy", Antonym: "inconvenient", Wordlist: false},
    { English: "accessory", Chinese: "辅助的，附属", Synonym: "peripheral", Antonym: "principal", Wordlist: false},
    { English: "accidental", Chinese: "意外发生的，偶然的", Synonym: "incidental", Antonym: "calculated", Wordlist: false},
    { English: "acclimate", Chinese: "使适应", Synonym: "adjust", Antonym: "make unfamiliar with", Wordlist: false},
    { English: "accolade", Chinese: "同意，赞赏", Synonym: "applause", Antonym: "disapprobation", Wordlist: false},
    { English: "accommodate", Chinese: "使和谐", Synonym: "conciliate", Antonym: "disharmonize", Wordlist: false},
    { English: "accrete", Chinese: "逐渐增长", Synonym: " accumulate", Antonym: "wear away", Wordlist: false},
    { English: "acerbic", Chinese: "酸涩的心情、心境或者语调", Synonym: "pungent", Antonym: "saccharin", Wordlist: false},
    { English: "acme", Chinese: "顶点，极点", Synonym: "culmination", Antonym: "bottom", Wordlist: false},
    { English: "acquiesce", Chinese: "勉强同意；默许", Synonym: "assent", Antonym: "resist", Wordlist: false},
    { English: "acumen", Chinese: "不同寻常的洞察力和鉴别力", Synonym: "keenness", Antonym: "unable to discerning", Wordlist: false},
    { English: "adamant", Chinese: "固执的，不可动摇的", Synonym: "hardheaded", Antonym: "vacillatory", Wordlist: false}
    
    
    
    
    
    ];
    
var wordsSchema = new mongoose.Schema({
    English: String,
    Chinese: String,
    Synonym: String,
    Antonym: String,
    Wordlist: Boolean,
    Comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comments"
        }
    ]
});

wordsSchema.set('autoIndex', false);

var grewords = mongoose.model("grewords", wordsSchema);

for ( var i = 0; i < words.length; i++) {
    grewords.create(words[i], function(err, word){
        if (err) {
            console.log(err);
        } else {
            console.log("DONE");
            // comments.create(
            //     {
            //     text:"I have already grasp.",
            //     author: "Tom Hu",
            //     likes: 10,
            //     dislikes: 20
            //     }, function(err, comments){
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log("Done");
            //             word.Comments.push(comments);
            //             word.save();
            //         }
                    
            //     })
        }
    });
}


