let SearchRequestExample = {
    "OTA_AirLowFareSearchRQ": {
        "Version": "2",
        "AltLangID": "en-us",
        "AvailableFlightsOnly": true,
        "DirectFlightsOnly": false,
        "SeparateMessages" : false,
        "MaxResponses" : "1",
        "POS": {
            "Source": [
                {
                    "PseudoCityCode": "HS5J",
                    "RequestorID": {
                        "Type": "1",
                        "ID": "1",
                        "CompanyName": {
                            "Code": "TN"
                        },
                    }
                }
            ]
        },
        "OriginDestinationInformation": [],
        "TravelPreferences": {
            "Baggage" : {
                "FreePieceRequired" : true,
                "RequestType" : "N",
            },
            "CabinPref" : [
                {
                    "Cabin" : "Economy",
                    "PreferLevel" : "Only"
                }
            ],
            "ETicketDesired" : true,
            "MaxStopsQuantity" : 9,
            "TPA_Extensions": {
                "DataSources": {
                    "ATPCO": "Enable",
                    "LCC": "Disable",
                    "NDC": "Disable"
                },
                "PreferNDCSourceOnTie": {
                    "Value": true
                },
                "NumTrips" : {
                    "Number" : 25
                }
            }
        },
        "TravelerInfoSummary": {
            "AirTravelerAvail": [
                {
                    "PassengerTypeQuantity": [
                        {
                            "Code": "ADT",
                            "Quantity": 1
                        }
                    ]
                }
            ],
            "SeatsRequested" : [1],
        },
        "TPA_Extensions": {
            "IntelliSellTransaction": {
                "RequestType": {
                    "Name": "200ITINS"
                }
            },
        },
    },
};
