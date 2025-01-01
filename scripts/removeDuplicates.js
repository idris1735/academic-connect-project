const fs = require('fs')
const path = require('path')

try {
  const filePath = path.join(__dirname, '../src/data/institutions.js')
  const fileContent = fs.readFileSync(filePath, 'utf8')

  // Split the file content into lines
  const lines = fileContent.split('\n')

  let startIndex = -1
  let endIndex = -1
  let bracketCount = 0
  let insideArray = false
  const arrayLines = []

  // Process each line to locate and extract the array
  lines.forEach((line, index) => {
    if (
      !insideArray &&
      line.trim().startsWith('export const nigerianInstitutions = [')
    ) {
      insideArray = true
      startIndex = index
    }

    if (insideArray) {
      arrayLines.push(line)
      bracketCount += (line.match(/\[/g) || []).length
      bracketCount -= (line.match(/\]/g) || []).length

      if (bracketCount === 0) {
        endIndex = index
        insideArray = false
      }
    }
  })

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      'Could not find the nigerianInstitutions array in the file.'
    )
  }

  const arrayString = arrayLines
    .join('\n')
    .replace('export const nigerianInstitutions =', '')
    .trim()

  console.log('Extracted Array String:', arrayString)

  // Parse the extracted array string
  const institutionsArray = eval(`(${arrayString})`) // Using eval to safely handle the array

  // Remove duplicates based on abbreviation
  const uniqueInstitutions = Array.from(
    new Map(institutionsArray.map((item) => [item.abbreviation, item])).values()
  )

  console.log(
    `Removed duplicates. Total institutions before: ${institutionsArray.length}, after: ${uniqueInstitutions.length}`
  )

  // Create the cleaned output
  const cleanedOutput = `
export const institutionTypes = [ /* ... your institution types ... */ ];

export const nigerianInstitutions = ${JSON.stringify(
    uniqueInstitutions,
    null,
    2
  )};

export const getInstitutionsByType = (type, stateFilter = null) => {
  let institutions = nigerianInstitutions.filter(inst => inst.institutionType === type);
  if (stateFilter) {
    institutions = institutions.filter(inst => inst.state === stateFilter);
  }
  return institutions;
};

export const getUniqueStates = () => {
  return [...new Set(nigerianInstitutions.map(inst => inst.state))].sort();
};

export const getAllInstitutions = (type = null) => {
  return type ? nigerianInstitutions.filter(inst => inst.institutionType === type) : nigerianInstitutions;
};
`

  // Write the cleaned data back to the file
  fs.writeFileSync(filePath, cleanedOutput)
  console.log('Duplicates removed and cleaned data saved successfully!')
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}
