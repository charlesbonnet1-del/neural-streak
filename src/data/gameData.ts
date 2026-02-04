import { Category, GameInfo, HallucinationData, FallacyData, TrilemmaData, HumanAiData, CausalData, SyntaxData, ClicheData, MetaphorData, SequenceData, AssociationData, UchroniaData, Color } from '../types';

export const COLORS: Color[] = ['cyan', 'magenta', 'yellow', 'purple', 'orange', 'green'];

export const COLOR_HEX: Record<Color, string> = {
    cyan: '#00ffd5',
    magenta: '#ff2d92',
    yellow: '#ffd000',
    purple: '#a855f7',
    orange: '#ff6b2c',
    green: '#22c55e',
};

export const CATEGORIES: Category[] = [
    { id: 'memory', name: 'Mémoire de Travail', icon: '🧠', color: 'cat-memory', stat: '-50%', statDesc: 'connectivité cérébrale', games: ['sequence', 'nback', 'chunking', 'updating'] },
    { id: 'critical', name: 'Pensée Critique', icon: '🔍', color: 'cat-critical', stat: '-36%', statDesc: 'pensée critique (Gerlich)', games: ['hallucination', 'fallacy', 'trilemma'] },
    { id: 'semantic', name: 'Mémoire Sémantique', icon: '📚', color: 'cat-semantic', stat: '72%', statDesc: 'amnésie numérique', games: ['causal', 'recall'] },
    { id: 'ownership', name: 'Sentiment d\'Auteur', icon: '✍️', color: 'cat-ownership', stat: '83%', statDesc: 'perte ownership', games: ['humanai', 'constraints'] },
    { id: 'linguistic', name: 'Compétences Linguistiques', icon: '💬', color: 'cat-linguistic', stat: '5.3x', statDesc: 'rigidité syntaxique', games: ['syntax', 'cliche', 'metaphor'] },
    { id: 'executive', name: 'Fonctions Exécutives', icon: '🎯', color: 'cat-executive', stat: '+23%', statDesc: 'perf. avec entraînement', games: ['sequencing', 'resources'] },
    { id: 'creative', name: 'Créativité', icon: '💡', color: 'cat-creative', stat: '∞', statDesc: 'potentiel créatif', games: ['associations', 'uchronia'] },
    { id: 'engagement', name: 'Engagement Neural', icon: '⚡', color: 'cat-engagement', stat: '0%', statDesc: 'effort avec ChatGPT', games: ['reaction', 'focus'] }
];

export const GAMES: Record<string, GameInfo> = {
    sequence: { name: 'Séquence Visuelle', desc: 'Mémorise et reproduis des séquences', icon: '🎨' },
    nback: { name: 'N-Back', desc: 'Identifie les répétitions N étapes avant', icon: '🔄' },
    chunking: { name: 'Chunking', desc: 'Regroupe pour mieux mémoriser', icon: '📦' },
    updating: { name: 'Liste Vivante', desc: 'Modifie une liste en temps réel', icon: '📝' },
    hallucination: { name: 'Spot the Hallucination', desc: 'Détecte les erreurs de l\'IA', icon: '🎭' },
    fallacy: { name: 'Bullshit Detector', desc: 'Identifie les sophismes', icon: '🚨' },
    trilemma: { name: 'Vrai / Faux / ?', desc: 'Distingue le vérifiable', icon: '❓' },
    causal: { name: 'Chaîne Causale', desc: 'Reconstruis les liens cause-effet', icon: '🔗' },
    recall: { name: 'Rappel Différé', desc: 'Mémorise puis rappelle après délai', icon: '🧩' },
    humanai: { name: 'Humain ou IA ?', desc: 'Identifie l\'origine des textes', icon: '🤖' },
    constraints: { name: 'Contraintes', desc: 'Construis avec des règles imposées', icon: '🎲' },
    syntax: { name: 'Puzzle Syntaxique', desc: 'Reconstruis les phrases', icon: '🧱' },
    cliche: { name: 'Langue Pure', desc: 'Détecte les clichés IA', icon: '✨' },
    metaphor: { name: 'Métaphores', desc: 'Choisis la meilleure analogie', icon: '🌈' },
    sequencing: { name: 'Remets dans l\'ordre', desc: 'Ordonne les étapes logiques', icon: '📊' },
    resources: { name: 'Gestionnaire', desc: 'Optimise les ressources', icon: '💎' },
    associations: { name: 'Connexions Improbables', desc: 'Relie des concepts éloignés', icon: '🔀' },
    uchronia: { name: 'Et si... ?', desc: 'Imagine les conséquences alternatives', icon: '🌀' },
    reaction: { name: 'Go / No-Go', desc: 'Réagis vite et bien', icon: '⚡' },
    focus: { name: 'Focus Soutenu', desc: 'Détecte les changements subtils', icon: '👁️' }
};

export const HALLUCINATION_DATA: HallucinationData[] = [
    { text: "La Tour Eiffel, construite en 1889, mesure 324 mètres. Elle devait être démontée après 20 ans. Elle accueille environ 7 millions de visiteurs par an.", hasError: false },
    { text: "Le cœur humain bat environ 100 000 fois par jour. Il pompe 5 litres de sang par minute et possède 6 cavités : deux oreillettes et quatre ventricules.", hasError: true, error: "Le cœur a 4 cavités, pas 6" },
    { text: "Python est un langage créé par Guido van Rossum en 1991. Le nom vient du groupe comique britannique Monty Python.", hasError: false },
    { text: "La photosynthèse permet aux plantes de convertir le CO2 en glucose grâce à la lumière. Ce processus se déroule dans les mitochondries.", hasError: true, error: "Dans les chloroplastes, pas les mitochondries" },
    { text: "Mozart a composé plus de 600 œuvres durant ses 35 ans de vie. Il a commencé à composer dès l'âge de 5 ans.", hasError: false },
    { text: "L'ADN humain contient environ 3 milliards de paires de bases et code pour environ 200 000 gènes.", hasError: true, error: "Environ 20 000 gènes, pas 200 000" },
    { text: "Van Gogh a peint 'La Nuit étoilée' en 1889. Durant sa vie, il a vendu des centaines de tableaux et était très reconnu.", hasError: true, error: "Il n'a vendu qu'un seul tableau de son vivant" },
    { text: "Le Bitcoin a été créé en 2009 par Satoshi Nakamoto. La première transaction a permis d'acheter deux pizzas pour 10 000 BTC.", hasError: false }
];

export const FALLACY_DATA: FallacyData[] = [
    { text: "Tous les experts sont d'accord, donc tu dois l'accepter sans questionner.", fallacy: "Appel à l'autorité", options: ["Appel à l'autorité", "Homme de paille", "Faux dilemme", "Pente glissante"] },
    { text: "Si on autorise le télétravail, bientôt plus personne ne viendra et l'entreprise fera faillite.", fallacy: "Pente glissante", options: ["Ad hominem", "Pente glissante", "Faux dilemme", "Généralisation"] },
    { text: "Soit tu es avec nous, soit tu es contre nous.", fallacy: "Faux dilemme", options: ["Faux dilemme", "Homme de paille", "Appel à l'émotion", "Circulaire"] },
    { text: "Mon grand-père a fumé toute sa vie et vécu jusqu'à 95 ans. Le tabac n'est pas dangereux.", fallacy: "Généralisation hâtive", options: ["Appel à la tradition", "Généralisation hâtive", "Post hoc", "Biais survivant"] },
    { text: "Tu ne peux pas critiquer mon projet, tu n'as même pas de diplôme.", fallacy: "Ad hominem", options: ["Ad hominem", "Appel à l'autorité", "Homme de paille", "Tu quoque"] },
    { text: "On a toujours fait comme ça, donc c'est la bonne méthode.", fallacy: "Appel à la tradition", options: ["Appel à la tradition", "Circulaire", "Appel à la nature", "Confirmation"] }
];

export const TRILEMMA_DATA: TrilemmaData[] = [
    { statement: "L'eau bout à 100°C au niveau de la mer.", answer: "true" },
    { statement: "La population mondiale atteindra 10 milliards en 2050.", answer: "unknown" },
    { statement: "Napoléon est mort en 1821 à Sainte-Hélène.", answer: "true" },
    { statement: "L'IA sera plus intelligente que l'humain d'ici 2030.", answer: "unknown" },
    { statement: "Le Soleil tourne autour de la Terre.", answer: "false" },
    { statement: "Shakespeare a écrit 'Don Quichotte'.", answer: "false" },
    { statement: "Le stress chronique affecte le système immunitaire.", answer: "true" },
    { statement: "Les dauphins sont les animaux les plus intelligents.", answer: "unknown" }
];

export const HUMAN_AI_DATA: HumanAiData[] = [
    { text: "Franchement, j'en ai marre de ces réunions qui servent à rien. Trois heures pour décider de la couleur d'un bouton.", author: "human" },
    { text: "Il est important de noter que les réunions constituent un élément essentiel de la collaboration. Cependant, leur efficacité peut être optimisée.", author: "ai" },
    { text: "Le café de la machine du 3ème est dégueulasse mais au moins y'a jamais la queue. Choix stratégique.", author: "human" },
    { text: "En conclusion, plusieurs axes d'amélioration peuvent être envisagés pour optimiser ce processus de manière significative.", author: "ai" },
    { text: "Ma grand-mère dit toujours que pour réussir un gâteau, faut pas ouvrir le four pendant 20 minutes. Elle a raison.", author: "human" },
    { text: "La cuisson des pâtisseries nécessite une attention particulière. Il est recommandé de suivre les instructions avec précision.", author: "ai" }
];

export const CAUSAL_DATA: CausalData[] = [
    { event: "Hausse des taux d'intérêt", steps: ["Banque centrale augmente les taux", "Emprunts plus chers", "Ménages empruntent moins", "Consommation ralentit", "Inflation diminue"] },
    { event: "Déforestation massive", steps: ["Coupe des arbres", "Perte d'habitat", "Érosion des sols", "Moins d'absorption CO2", "Changement climatique"] },
    { event: "Produit viral", steps: ["Innovation produit", "Premiers enthousiastes", "Bouche-à-oreille", "Couverture médiatique", "Adoption massive"] }
];

export const SYNTAX_DATA: SyntaxData[] = [
    { fragments: ["malgré", "réussi", "il a", "les obstacles", "son objectif"], correct: [2, 0, 3, 1, 4] },
    { fragments: ["plus", "travaille", "on", "apprend", "on", "plus"], correct: [0, 2, 1, 5, 4, 3] },
    { fragments: ["jamais", "n'est", "trop", "tard", "apprendre", "il", "pour"], correct: [5, 1, 0, 2, 3, 6, 4] }
];

export const CLICHE_DATA: ClicheData[] = [
    { text: "Il est important de noter que ce projet présente des défis significatifs.", hasCliche: true, cliches: ["Il est important de noter", "défis significatifs"] },
    { text: "L'équipe a travaillé dur pour livrer à temps.", hasCliche: false },
    { text: "En conclusion, plusieurs axes d'amélioration peuvent être envisagés.", hasCliche: true, cliches: ["En conclusion", "axes d'amélioration", "peuvent être envisagés"] },
    { text: "Nous avons raté la deadline, il faut revoir notre planning.", hasCliche: false },
    { text: "Cette solution permet d'optimiser les processus de manière significative.", hasCliche: true, cliches: ["permet d'optimiser", "de manière significative"] }
];

export const METAPHOR_DATA: MetaphorData[] = [
    { concept: "La procrastination", options: ["Un compte à rebours inversé", "Des sables mouvants", "Une avalanche en préparation", "Un élastique tendu"], best: 2 },
    { concept: "L'apprentissage", options: ["Construire un pont", "Remplir un verre", "Sculpter une statue", "Allumer des lumières"], best: 2 },
    { concept: "La créativité", options: ["Un muscle", "Une rivière", "Un jardin sauvage", "Un feu de camp"], best: 2 },
    { concept: "L'échec", options: ["Un mur", "Un tremplin", "Une leçon", "Un GPS recalculant"], best: 1 }
];

export const SEQUENCE_DATA: SequenceData[] = [
    { title: "Faire un café", steps: ["Remplir le réservoir", "Mettre le café", "Allumer la machine", "Attendre", "Verser"] },
    { title: "Envoyer un email pro", steps: ["Ouvrir le client", "Rédiger l'objet", "Écrire le message", "Vérifier destinataires", "Envoyer"] },
    { title: "Résoudre un bug", steps: ["Reproduire le bug", "Identifier la cause", "Écrire le fix", "Tester", "Déployer"] },
    { title: "Préparer une présentation", steps: ["Définir l'objectif", "Structurer le plan", "Créer les slides", "Répéter", "Présenter"] }
];

export const ASSOCIATION_DATA: AssociationData[] = [
    { word1: "Glacier", word2: "Startup", links: ["Mouvement lent vs rapide", "Fondation solide nécessaire", "Peut s'effondrer brutalement"] },
    { word1: "Bibliothèque", word2: "Jungle", links: ["Exploration nécessaire", "Trésors cachés", "Peut se perdre facilement"] },
    { word1: "Horloge", word2: "Rivière", links: ["Flux continu", "Une seule direction", "Impossible à remonter"] },
    { word1: "Orchestre", word2: "Équipe projet", links: ["Besoin d'harmonie", "Un chef coordonne", "Chacun sa partition"] }
];

export const UCHRONIA_DATA: UchroniaData[] = [
    { scenario: "Et si Internet n'avait jamais existé ?", consequences: ["Journaux papier dominants", "Commerce local", "Bibliothèques essentielles", "Pas de télétravail"], absurd: "Les poissons auraient conquis la Terre" },
    { scenario: "Et si les humains hibernaient ?", consequences: ["Économie saisonnière", "Chambres d'hibernation", "Pas de fêtes d'hiver", "Réserves vitales"], absurd: "Les voitures auraient des roues carrées" },
    { scenario: "Et si l'écriture n'existait pas ?", consequences: ["Tradition orale dominante", "Contrats verbaux", "Mémoire développée", "Histoire par griots"], absurd: "Les arbres parleraient français" }
];
