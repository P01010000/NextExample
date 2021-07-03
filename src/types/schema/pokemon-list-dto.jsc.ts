export default {
  "type": "object",
  "properties": {
    "count": {
      "type": "number"
    },
    "next": {
      "type": [
        "null",
        "string"
      ]
    },
    "previous": {
      "type": [
        "null",
        "string"
      ]
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
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
    }
  },
  "required": [
    "count",
    "next",
    "previous",
    "results"
  ],
  "$schema": "http://json-schema.org/draft-07/schema#"
}