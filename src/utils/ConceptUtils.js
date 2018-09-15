function isConceptNameSelected(concept = '', selectedConcepts = []) {

  for (const selectedConcept of selectedConcepts) {
    if (selectedConcept.label === concept) {
      return true;
    }
  }
  return false;
};

export { isConceptNameSelected };
