//form keys
var FormKeys = {
    "field_1": "",
    "field_2": "",
    "field_3": "",
    "field_4": "",
    "field_5": "",
    "field_6": "",
    "field_7": "",
    "field_8": "",
    "field_9": "",
    "field_10": "",
    "field_11": "",
    "field_12": "",
    "field_13": "",
    "field_14": "",
    "field_15": "",
    "field_16": "",
    "field_17": "",
    "field_18": "",
    "field_19": "",
    "field_20": "",
    "field_21": "",
    "field_22": "",
    "field_23": "",
    "field_24": "",
    "field_25": "",
    "field_26": "",
    "field_27": "",
    "field_28": "",
    "field_29": ""
};

//form schema
var FormSchema = {
    fields: [
        {
            type: "input",
            inputType: "text",
            label: "Text",
            model: "field_1"
        },
        {
            type: "input",
            inputType: "password",
            label: "Password",
            model: "field_2",
            min: 6,
            required: true,
            hint: "Minimum 6 characters",
        },
        {
            type: "textArea",
            label: "Textarea",
            model: "field_3",
        },
        {
            type: "input",
            inputType: "number",
            label: "Age",
            model: "field_4",
            min: 18,
        },
        {
            type: "input",
            inputType: "email",
            label: "E-mail",
            model: "field_5",
            placeholder: "User's e-mail address",
        },
        {
            type: "checkbox",
            label: "Checkbox",
            model: "field_6",
            values: ["Use HTML5"]
        },
        {
            type: "radios",
            label: "Radio",
            model: "field_7",
            values: ["HTML5", "Javascript", "CSS3", "CoffeeScript", "AngularJS", "ReactJS", "VueJS"]
        },
        {
            type: "select",
            label: "Select",
            model: "field_8",
            values: ["HTML5", "Javascript", "CSS3", "CoffeeScript", "AngularJS", "ReactJS", "VueJS"]
        },
        {
            type: "checklist",
            label: "Checklist",
            model: "field_9",
            multi: true,
            required: true,
            multiSelect: true,
            listBox: true,
            values: ["HTML5", "Javascript", "CSS3", "CoffeeScript", "AngularJS", "ReactJS", "VueJS"]
        },
        {
            type: "switch",
            label: "Switch",
            model: "field_10",
            textOn: "Active",
            textOff: "Inactive"
        },
    ]
};

var CleaveSchema = {
    groups: [
        {
            legend: "Optional Fields",
            fields: [
                {
                    type: "cleave",
                    label: "Credit card number formatting",
                    model: "field_11",
                    cleaveOptions: {
                        creditCard: true,
                        onCreditCardTypeChanged: function(type) {
                            console.log("onCreditCardTypeChanged", type);
                        }
                    }
                },
                {
                    type: "cleave",
                    label: "Phone number formatting",
                    model: "field_12",
                    cleaveOptions: {
                        phone: true,
                        phoneRegionCode: 'PK',
                    }
                },
                {
                    type: "cleave",
                    label: "Date formatting",
                    model: "field_13",
                    cleaveOptions: {
                        date: true,
                        datePattern: ['d', 'm', 'Y'],
                    }
                },
                {
                    type: "cleave",
                    label: "Numeral formatting",
                    model: "field_14",
                    cleaveOptions: {
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                        numeralDecimalScale: 2,
                        numeralDecimalMark: '.',
                    }
                },
                {
                    type: "cleave",
                    label: "Custom formatting",
                    model: "field_15",
                    cleaveOptions: {
                        blocks: [0, 2, 0, 3, 4],
                        delimiter: ' ',
                        delimiters: ['(', ')', ' ', '-', '-'],
                        numericOnly: true,
                        uppercase: false,
                        lowercase: false
                    }
                },
            ],
        },
        {
            legend: "Masked Fields",
            fields: [

                {
                    type: "masked",
                    label: "Mobile phone",
                    model: "field_16",
                    mask: "(99) 999-9999"
                },
                {
                    type: "masked",
                    label: "Date",
                    model: "field_17",
                    mask: "99/99/9999",
                    maskOptions: {
                        placeholder: "mm/dd/yyyy"
                    }
                }
            ]
        },
        {
            legend: "Date time",
            fields: [
                {
                    type: "vueMultiSelect",
                    model: "field_18",
                    label: "Libraries",
                    placeholder: "Select your favorite library",
                    required: true,
                    selectOptions: {
                        multiple: false,
                        key: "name",
                        label: "name",
                        searchable: true,
                        customLabel: function({ name, language }) {
                            return `${name} — [${language}]`
                        }
                    },
                    values: [
                        {
                            "name": "Vue.js",
                            "language": "JavaScript"
                        },
                        {
                            "name": "Rails",
                            "language": "Ruby"
                        },
                        {
                            "name": "Sinatra",
                            "language": "Ruby"
                        }
                    ]
                }
            ]
        }
    ],

};
