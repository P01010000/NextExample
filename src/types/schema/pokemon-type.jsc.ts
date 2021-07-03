export default {
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