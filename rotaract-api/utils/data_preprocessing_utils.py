def standardize_name(name):
    # Split the name into parts
    parts = name.replace(".", " ").split()

    # Separate initials (single letters) and other parts
    initials = [part for part in parts if len(part) == 1]
    non_initials = [part for part in parts if len(part) > 1]

    # Combine non-initials first and append initials at the end
    standardized_name = " ".join(non_initials) + " " + " ".join(initials)

    # Ensure proper capitalization
    return standardized_name.title()

