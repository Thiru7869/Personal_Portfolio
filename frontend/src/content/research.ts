import type { ResearchPaper } from "@shared/types";

/**
 * src/content/research.ts
 * ------------------------------------------------------------
 * The research paper highlighted across the site (hero badge,
 * research section, AI assistant, terminal `research` command).
 * Update fields here when publication details change, and
 * replace public/research/paper.pdf with the full PDF.
 */

export const researchPaper: ResearchPaper = {
  title:
    "Innovative Deep Learning Approaches for ECG-Based Cardiovascular Disease Detection",
  authors: ["Thirumala Narasimha Poluru", "et al."],
  venue: "International Journal of Novel Research and Development (IJNRD)",
  year: 2025,
  status: "Published",
  abstract:
    "Cardiovascular disease remains the leading cause of death worldwide, and early detection from electrocardiogram (ECG) signals is one of the most practical paths to reducing that toll. This work explores deep learning architectures for classifying cardiovascular conditions directly from ECG signals, comparing convolutional and recurrent approaches on preprocessed signal data. We address the practical problems that keep such models out of clinics — noisy real-world signals, class imbalance across rarer conditions, and the gap between benchmark accuracy and dependable behaviour on unseen patients — using signal preprocessing, augmentation, and careful evaluation protocols. The proposed approach achieves strong classification performance while remaining computationally light enough for deployment on modest hardware, and the paper discusses where such systems can responsibly assist, and where they must defer to clinicians.",
  contributions: [
    "A preprocessing and augmentation pipeline that improves robustness on noisy, real-world ECG signals",
    "A comparative evaluation of CNN and recurrent architectures for multi-class cardiovascular condition detection",
    "Handling of class imbalance so rarer conditions aren't drowned out by common ones",
    "A deployment-conscious design that keeps inference practical on modest hardware",
  ],
  keywords: [
    "Deep Learning",
    "ECG Classification",
    "Cardiovascular Disease",
    "Signal Processing",
    "Machine Learning in Healthcare",
  ],
  publicationUrl:
    "https://ijnrd.org/author_details.php?name=P.Thirumala+Narasimha&slot=5",
  downloadUrl: "https://ijnrd.org/papers/IJNRD2503033.pdf",
  doi: "IJNRD2503033",
  citation:
    "Poluru, T. N. et al. (2025). Innovative Deep Learning Approaches for ECG-Based Cardiovascular Disease Detection. International Journal of Novel Research and Development (IJNRD), paper IJNRD2503033.",
};
