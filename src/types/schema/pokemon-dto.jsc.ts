export default {
  "type": "object",
  "properties": {
    "height": {
      "type": "number"
    },
    "order": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "weight": {
      "type": "number"
    },
    "types": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "slot": {
            "type": "number"
          },
          "type": {
            "type": "object",
            "properties": {
              "name": {
                "$ref": "#/definitions/ElementTypes"
              },
              "url": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "url"
            ]
          }
        },
        "required": [
          "slot",
          "type"
        ]
      }
    }
  },
  "required": [
    "height",
    "name",
    "order",
    "types",
    "weight"
  ],
  "definitions": {
    "ElementTypes": {
      "enum": [
        "bug",
        "dark",
        "dragon",
        "electric",
        "fairy",
        "fighting",
        "fire",
        "flying",
        "ghost",
        "grass",
        "ground",
        "ice",
        "normal",
        "poison",
        "psychic",
        "rock",
        "steel",
        "water"
      ],
      "type": "string"
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}