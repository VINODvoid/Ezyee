import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator"

// Returns a readable, hyphenated two-word slug like "dominant-wasp".
export function generateSlug() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  })
}
