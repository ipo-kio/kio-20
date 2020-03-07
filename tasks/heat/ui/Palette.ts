//taken from Wolfram Mathematica
//Table[ColorData["TemperatureMap",i],{i,0,1,0.005}]

const colors = [
    [0.178927, 0.305394, 0.933501],
    [0.18671614, 0.31358088, 0.93394458],
    [0.19450528, 0.32176776, 0.93438816],
    [0.20229442, 0.32995464, 0.93483174],
    [0.21008356, 0.33814152, 0.93527532],
    [0.2178727, 0.3463284, 0.9357189],
    [0.22566184, 0.35451528, 0.93616248],
    [0.23345098000000003, 0.36270216, 0.93660606],
    [0.24124012, 0.37088904, 0.93704964],
    [0.24902926000000003, 0.37907592, 0.93749322],
    [0.2568184, 0.3872628, 0.9379368],
    [0.26460754000000003, 0.39544968, 0.93838038],
    [0.27239668, 0.40363656000000003, 0.93882396],
    [0.28018582000000003, 0.41182344000000004, 0.93926754],
    [0.28797496, 0.42001032000000005, 0.93971112],
    [0.29576410000000003, 0.4281972, 0.9401547],
    [0.30355324, 0.43638408, 0.94059828],
    [0.31163744000000004, 0.44434642, 0.94107824],
    [0.32031176, 0.45185968, 0.94163096],
    [0.32898608, 0.45937294, 0.94218368],
    [0.3376604, 0.46688620000000003, 0.9427364],
    [0.34633472000000004, 0.47439946, 0.94328912],
    [0.35500904, 0.48191272, 0.94384184],
    [0.36368336, 0.48942598000000004, 0.94439456],
    [0.37235768, 0.49693924, 0.9449472800000001],
    [0.38103200000000004, 0.5044525, 0.9455],
    [0.38970632000000005, 0.51196576, 0.94605272],
    [0.39838064000000006, 0.51947902, 0.94660544],
    [0.40705496, 0.52699228, 0.94715816],
    [0.41572928, 0.53450554, 0.94771088],
    [0.4244036, 0.5420188, 0.9482636],
    [0.43307792, 0.54953206, 0.94881632],
    [0.44175224, 0.55704532, 0.94936904],
    [0.45042656000000003, 0.56455858, 0.9499217600000001],
    [0.46087964000000003, 0.57320188, 0.95070128],
    [0.47222210000000003, 0.5824102, 0.9515942000000001],
    [0.48356456, 0.59161852, 0.95248712],
    [0.49490702000000003, 0.60082684, 0.95338004],
    [0.50624948, 0.61003516, 0.95427296],
    [0.51759194, 0.6192434800000001, 0.95516588],
    [0.5289344, 0.6284518, 0.9560588],
    [0.5402768600000001, 0.63766012, 0.95695172],
    [0.55161932, 0.64686844, 0.95784464],
    [0.56296178, 0.65607676, 0.95873756],
    [0.57430424, 0.6652850800000001, 0.95963048],
    [0.5856467000000001, 0.6744934, 0.9605234],
    [0.59698916, 0.6837017200000001, 0.96141632],
    [0.6083316200000001, 0.6929100400000001, 0.96230924],
    [0.61967408, 0.70211836, 0.9632021599999999],
    [0.63101654, 0.71132668, 0.96409508],
    [0.642359, 0.720535, 0.964988],
    [0.6530165, 0.72886072, 0.96605024],
    [0.6636740000000001, 0.73718644, 0.9671124799999999],
    [0.6743315000000001, 0.7455121600000001, 0.9681747199999999],
    [0.6849890000000001, 0.7538378800000001, 0.9692369599999999],
    [0.6956465000000001, 0.7621636, 0.9702992],
    [0.706304, 0.77048932, 0.97136144],
    [0.7169615000000001, 0.7788150400000001, 0.97242368],
    [0.727619, 0.78714076, 0.97348592],
    [0.7382765, 0.79546648, 0.97454816],
    [0.748934, 0.8037922, 0.9756104],
    [0.7595915000000001, 0.81211792, 0.97667264],
    [0.7702490000000001, 0.82044364, 0.97773488],
    [0.7809065000000001, 0.82876936, 0.97879712],
    [0.791564, 0.83709508, 0.97985936],
    [0.8022215000000001, 0.8454208000000001, 0.9809216000000001],
    [0.8128790000000001, 0.8537465200000001, 0.98198384],
    [0.8222983000000001, 0.86114236, 0.9829127400000001],
    [0.8292412000000001, 0.86667844, 0.98357496],
    [0.8361841000000001, 0.87221452, 0.98423718],
    [0.8431270000000001, 0.8777506, 0.9848994],
    [0.8500699, 0.88328668, 0.98556162],
    [0.8570128, 0.8888227599999999, 0.98622384],
    [0.8639557, 0.89435884, 0.98688606],
    [0.8708986, 0.8998949199999999, 0.98754828],
    [0.8778414999999999, 0.905431, 0.9882105],
    [0.8847844, 0.91096708, 0.98887272],
    [0.8917273, 0.91650316, 0.98953494],
    [0.8986702, 0.92203924, 0.99019716],
    [0.9056131, 0.92757532, 0.99085938],
    [0.9125559999999999, 0.9331114, 0.9915216],
    [0.9194989, 0.93864748, 0.9921838199999999],
    [0.9264418, 0.94418356, 0.99284604],
    [0.9333847, 0.94971964, 0.99350826],
    [0.9376387199999999, 0.9530116399999999, 0.9904455600000001],
    [0.9405482999999999, 0.9551816, 0.9855204],
    [0.94345788, 0.95735156, 0.98059524],
    [0.9463674599999999, 0.95952152, 0.97567008],
    [0.9492770399999999, 0.96169148, 0.97074492],
    [0.95218662, 0.96386144, 0.96581976],
    [0.9550962, 0.9660314, 0.9608945999999999],
    [0.9580057799999999, 0.96820136, 0.95596944],
    [0.96091536, 0.97037132, 0.95104428],
    [0.96382494, 0.9725412800000001, 0.94611912],
    [0.9667345199999999, 0.97471124, 0.94119396],
    [0.9696441, 0.9768812, 0.9362687999999999],
    [0.97255368, 0.97905116, 0.93134364],
    [0.9754632599999999, 0.9812211200000001, 0.92641848],
    [0.9783728399999999, 0.98339108, 0.92149332],
    [0.98128242, 0.98556104, 0.91656816],
    [0.984192, 0.987731, 0.911643],
    [0.9848574, 0.9880061600000001, 0.9006156],
    [0.9855227999999999, 0.98828132, 0.8895881999999999],
    [0.9861882, 0.9885564800000001, 0.8785607999999999],
    [0.9868536, 0.98883164, 0.8675333999999999],
    [0.9875189999999999, 0.9891068000000001, 0.856506],
    [0.9881844, 0.98938196, 0.8454786],
    [0.9888498, 0.9896571200000001, 0.8344512],
    [0.9895151999999999, 0.98993228, 0.8234237999999999],
    [0.9901806, 0.99020744, 0.8123963999999999],
    [0.990846, 0.9904826, 0.8013689999999999],
    [0.9915114, 0.99075776, 0.7903415999999999],
    [0.9921768, 0.99103292, 0.7793142],
    [0.9928422, 0.99130808, 0.7682867999999999],
    [0.9935076, 0.99158324, 0.7572593999999999],
    [0.994173, 0.9918584, 0.7462319999999999],
    [0.9948384, 0.99213356, 0.7352046000000001],
    [0.9952264200000001, 0.99219812, 0.7218034600000003],
    [0.99505968, 0.99184148, 0.7036548400000002],
    [0.9948929400000001, 0.99148484, 0.6855062200000002],
    [0.9947262, 0.9911282, 0.6673576000000001],
    [0.9945594600000001, 0.99077156, 0.64920898],
    [0.99439272, 0.99041492, 0.6310603600000001],
    [0.9942259800000001, 0.9900582800000001, 0.61291174],
    [0.99405924, 0.98970164, 0.59476312],
    [0.9938925000000001, 0.989345, 0.5766145],
    [0.99372576, 0.98898836, 0.55846588],
    [0.99355902, 0.98863172, 0.5403172599999999],
    [0.99339228, 0.9882750800000001, 0.5221686399999999],
    [0.99322554, 0.9879184400000001, 0.5040200199999998],
    [0.9930588, 0.9875618, 0.48587139999999984],
    [0.99289206, 0.98720516, 0.4677227799999998],
    [0.99272532, 0.98684852, 0.4495741599999998],
    [0.99255858, 0.9864918800000001, 0.4314255399999997],
    [0.9910414, 0.9814426799999999, 0.41969795999999987],
    [0.988849, 0.9740471999999999, 0.41118089999999985],
    [0.9866566, 0.9666517199999999, 0.40266383999999983],
    [0.9844642, 0.9592562399999999, 0.3941467799999998],
    [0.9822718, 0.9518607599999999, 0.38562971999999984],
    [0.9800793999999999, 0.9444652799999999, 0.3771126599999998],
    [0.977887, 0.9370697999999998, 0.3685955999999998],
    [0.9756946000000001, 0.92967432, 0.36007854],
    [0.9735022, 0.92227884, 0.35156148],
    [0.9713098, 0.91488336, 0.34304442],
    [0.9691174, 0.90748788, 0.33452736],
    [0.966925, 0.9000924, 0.3260103],
    [0.9647326, 0.89269692, 0.31749324],
    [0.9625402000000001, 0.88530144, 0.30897618],
    [0.9603478, 0.87790596, 0.30045911999999997],
    [0.9581554, 0.87051048, 0.29194206],
    [0.955963, 0.863115, 0.283425],
    [0.95285884, 0.85080804, 0.28092732],
    [0.94975468, 0.83850108, 0.27842964],
    [0.94665052, 0.8261941199999999, 0.27593196],
    [0.94354636, 0.8138871599999999, 0.27343428],
    [0.9404422, 0.8015802, 0.27093659999999997],
    [0.93733804, 0.78927324, 0.26843891999999997],
    [0.93423388, 0.7769662799999999, 0.26594123999999997],
    [0.9311297199999999, 0.7646593199999999, 0.26344355999999997],
    [0.92802556, 0.7523523599999999, 0.26094587999999996],
    [0.9249214, 0.7400454, 0.2584482],
    [0.92181724, 0.72773844, 0.25595052],
    [0.91871308, 0.7154314799999999, 0.25345284],
    [0.9156089199999999, 0.7031245199999999, 0.25095516],
    [0.91250476, 0.6908175599999999, 0.24845748],
    [0.9094006, 0.6785105999999999, 0.2459598],
    [0.90629644, 0.6662036399999999, 0.24346212],
    [0.9033105600000001, 0.6538376600000002, 0.24103230000000003],
    [0.90056124, 0.6413536400000002, 0.23873820000000004],
    [0.89781192, 0.6288696200000001, 0.23644410000000005],
    [0.8950626, 0.6163856000000001, 0.23415000000000002],
    [0.89231328, 0.60390158, 0.23185590000000003],
    [0.88956396, 0.59141756, 0.2295618],
    [0.88681464, 0.5789335400000001, 0.22726770000000002],
    [0.88406532, 0.56644952, 0.2249736],
    [0.881316, 0.5539655, 0.2226795],
    [0.8785666799999999, 0.54148148, 0.2203854],
    [0.87581736, 0.5289974599999999, 0.2180913],
    [0.8730680399999999, 0.51651344, 0.2157972],
    [0.87031872, 0.50402942, 0.21350309999999997],
    [0.8675693999999999, 0.4915453999999999, 0.21120899999999998],
    [0.86482008, 0.47906137999999987, 0.20891489999999996],
    [0.8620707599999999, 0.46657735999999983, 0.20662079999999997],
    [0.85932144, 0.4540933399999998, 0.20432669999999997],
    [0.8567615599999999, 0.43729979999999974, 0.20198823999999996],
    [0.8542964, 0.4183514999999997, 0.19962759999999996],
    [0.85183124, 0.3994031999999997, 0.19726695999999996],
    [0.8493660799999999, 0.3804548999999997, 0.19490631999999997],
    [0.84690092, 0.3615065999999997, 0.19254567999999997],
    [0.84443576, 0.34255829999999965, 0.19018503999999994],
    [0.8419705999999999, 0.3236099999999997, 0.18782439999999995],
    [0.8395054399999999, 0.30466169999999965, 0.18546375999999995],
    [0.83704028, 0.28571340000000006, 0.18310312],
    [0.83457512, 0.2667651000000001, 0.18074248],
    [0.83210996, 0.24781680000000006, 0.17838184],
    [0.8296448, 0.22886850000000006, 0.17602120000000002],
    [0.82717964, 0.20992020000000003, 0.17366056000000002],
    [0.82471448, 0.19097190000000003, 0.17129992],
    [0.8222493200000001, 0.1720236, 0.16893928],
    [0.81978416, 0.15307530000000003, 0.16657864],
    [0.817319, 0.134127, 0.164218]
];
const ind2color: string[] = new Array(colors.length);

export class Palette {

    static palette0100 = new Palette(0, 50);

    private min: number;
    private max: number;
    static readonly DEFAULT_VALUE: number = -100;
    static readonly DEFAULT_COLOR: string = 'rgb(200, 200, 200)';

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;

        for (let ind = 0; ind < colors.length; ind++) {
            let c = colors[ind];
            ind2color[ind] = `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
        }
    }

    get(v: number): string {
        if (v === Palette.DEFAULT_VALUE)
            return Palette.DEFAULT_COLOR;

        if (v < this.min)
            v = this.min;
        if (v > this.max)
            v = this.max;

        let v_normalized = (v - this.min) / (this.max - this.min);
        let index = Math.floor(v_normalized * colors.length);
        if (index >= colors.length)
            index = colors.length - 1;
        if (index < 0)
            index = 0;

        return ind2color[index];
    }
}

