import { Category, GameInfo, HallucinationData, FallacyData, TrilemmaData, HumanAiData, CausalData, SyntaxData, ClicheData, MetaphorData, SequenceData, AssociationData, UchroniaData, Color, ConstraintsData, ResourcesData } from '../types';

export const COLORS: Color[] = ['cyan', 'magenta', 'yellow', 'purple', 'orange', 'green', 'red', 'blue'];

export const COLOR_HEX: Record<Color, string> = {
    cyan: '#00ffd5',
    magenta: '#ff2d92',
    yellow: '#ffd000',
    purple: '#a855f7',
    orange: '#ff6b2c',
    green: '#22c55e',
    red: '#ef4444',
    blue: '#3b82f6',
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
    sequence: {
        name: 'Séquence Visuelle',
        desc: 'Mémorise et reproduis des séquences',
        icon: '🎨',
        categoryId: 'memory',
        tutorial: 'Mémorise l\'ordre d\'apparition des couleurs et reproduis la séquence exacte en cliquant sur les cases.'
    },
    nback: {
        name: 'N-Back',
        desc: 'Identifie les répétitions N étapes avant',
        icon: '🔄',
        categoryId: 'memory',
        tutorial: 'Appuie sur MATCH si la couleur actuelle est identique à celle apparue N étapes auparavant.'
    },
    chunking: {
        name: 'Chunking',
        desc: 'Regroupe pour mieux mémoriser',
        icon: '📦',
        categoryId: 'memory',
        tutorial: 'Regroupe les éléments par catégories ou caractéristiques communes pour augmenter ta capacité de mémorisation.'
    },
    updating: {
        name: 'Liste Vivante',
        desc: 'Modifie une liste en temps réel',
        icon: '📝',
        categoryId: 'memory',
        tutorial: 'Garde en mémoire une liste d\'éléments qui change constamment. Seuls les derniers éléments comptent.'
    },
    hallucination: {
        name: 'Spot the Hallucination',
        desc: 'Détecte les erreurs de l\'IA',
        icon: '🎭',
        categoryId: 'critical',
        tutorial: 'Analyse le texte généré par l\'IA et identifie les erreurs factuelles ou les "hallucinations" logiques.'
    },
    fallacy: {
        name: 'Bullshit Detector',
        desc: 'Identifie les sophismes',
        icon: '🚨',
        categoryId: 'critical',
        tutorial: 'Repère les failles de raisonnement et les sophismes classiques (homme de paille, faux dilemme, etc.).'
    },
    trilemma: {
        name: 'Vrai / Faux / ?',
        desc: 'Distingue le vérifiable',
        icon: '❓',
        categoryId: 'critical',
        tutorial: 'Distingue les faits prouvés, les faussetés et les affirmations invérifiables.'
    },
    causal: {
        name: 'Chaîne Causale',
        desc: 'Reconstruis les liens cause-effet',
        icon: '🔗',
        categoryId: 'semantic',
        tutorial: 'Remets dans l\'ordre logique les étapes d\'un processus de cause à effet.'
    },
    recall: {
        name: 'Rappel Différé',
        desc: 'Mémorise puis rappelle après délai',
        icon: '🧩',
        categoryId: 'semantic',
        tutorial: 'Mémorise une liste de mots, effectue une tâche de distraction, puis rappelle le maximum de mots.'
    },
    humanai: {
        name: 'Humain ou IA ?',
        desc: 'Identifie l\'origine des textes',
        icon: '🤖',
        categoryId: 'ownership',
        tutorial: 'Analyse le style, la syntaxe et le ton pour deviner si le texte a été écrit par un humain ou une IA.'
    },
    constraints: {
        name: 'Contraintes',
        desc: 'Construis avec des règles imposées',
        icon: '🎲',
        categoryId: 'ownership',
        tutorial: 'Produis un contenu original en respectant des contraintes strictes qui forcent ta créativité.'
    },
    syntax: {
        name: 'Puzzle Syntaxique',
        desc: 'Reconstruis les phrases',
        icon: '🧱',
        categoryId: 'linguistic',
        tutorial: 'Réassemble les fragments de phrase pour reconstruire une structure grammaticale correcte.'
    },
    cliche: {
        name: 'Langue Pure',
        desc: 'Détecte les clichés IA',
        icon: '✨',
        categoryId: 'linguistic',
        tutorial: 'Identifie les expressions stéréotypées et les tics de langage typiques des modèles de langue.'
    },
    metaphor: {
        name: 'Métaphores',
        desc: 'Choisis la meilleure analogie',
        icon: '🌈',
        categoryId: 'linguistic',
        tutorial: 'Trouve l\'analogie la plus pertinente pour expliquer un concept complexe.'
    },
    sequencing: {
        name: 'Remets dans l\'ordre',
        desc: 'Ordonne les étapes logiques',
        icon: '📊',
        categoryId: 'executive',
        tutorial: 'Ordonne chronologiquement les étapes d\'une tâche complexe pour optimiser son exécution.'
    },
    resources: {
        name: 'Gestionnaire',
        desc: 'Optimise les ressources',
        icon: '💎',
        categoryId: 'executive',
        tutorial: 'Alloue tes ressources limitées (temps, budget) pour maximiser la valeur totale de tes objectifs.'
    },
    associations: {
        name: 'Connexions Improbables',
        desc: 'Relie des concepts éloignés',
        icon: '🔀',
        categoryId: 'creative',
        tutorial: 'Trouve des liens logiques ou créatifs entre deux concepts qui n\'ont apparemment rien en commun.'
    },
    uchronia: {
        name: 'Et si... ?',
        desc: 'Imagine les conséquences alternatives',
        icon: '🌀',
        categoryId: 'creative',
        tutorial: 'Explore les conséquences d\'un changement historique ou d\'un scénario imaginaire.'
    },
    reaction: {
        name: 'Go / No-Go',
        desc: 'Réagis vite et bien',
        icon: '⚡',
        categoryId: 'engagement',
        tutorial: 'Réagis le plus rapidement possible aux stimuli positifs et inhibe ta réponse aux stimuli négatifs.'
    },
    focus: {
        name: 'Focus Soutenu',
        desc: 'Détecte les changements subtils',
        icon: '👁️',
        categoryId: 'engagement',
        tutorial: 'Maintiens ton attention sur une longue durée pour repérer des variations minimes dans ton environnement.'
    }
};

export const HALLUCINATION_DATA: HallucinationData[] = [
    { text: "Pierre est plus grand que Paul. Paul est plus grand que Jacques. Jacques est donc le plus petit des trois.", hasError: false },
    { text: "Si tous les chats sont des mammifères et que tous les mammifères ont un cœur, alors tous les chats ont un cœur.", hasError: false },
    { text: "Un avion transportant 50 passagers s'écrase sur la frontière entre la France et l'Espagne. On enterre les 20 survivants en Espagne.", hasError: true, error: "On n'enterre pas les survivants." },
    { text: "Marie a trois frères : Luc, Jean et Marc. Marc a donc deux frères et une sœur.", hasError: false },
    { text: "Un sac contient 5 billes rouges et 3 billes bleues. Si j'ajoute 2 billes vertes, le sac contient maintenant un total de 11 billes.", hasError: true, error: "5 + 3 + 2 = 10, pas 11." },
    { text: "Si demain est lundi, alors hier était samedi et aujourd'hui est dimanche.", hasError: false },
    { text: "Une boîte contient 12 œufs. Si j'en casse trois et que j'en mange deux, il reste 9 œufs entiers dans la boîte.", hasError: true, error: "12 - 3 = 9 cassés, mais seulement 9 restaient au total avant d'en manger. S'il en reste 9, ils ne sont pas tous entiers." },
    { text: "Alice court plus vite que Bob. Bob court plus vite que Charlie. Donc Charlie court moins vite qu'Alice.", hasError: false },
    { text: "Certains mois ont 30 jours, d'autres en ont 31. Combien de mois en ont 28 ? La réponse est : tous.", hasError: false },
    { text: "Le père de Sophie a 5 filles : Lala, Lele, Lili, Lolo. La cinquième s'appelle Lulu.", hasError: true, error: "La cinquième fille s'appelle Sophie." }
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
    { statement: "Si tous les A sont des B, et que cet objet est un A, alors cet objet est un B.", answer: "true" },
    { statement: "Un triangle rectangle possède deux angles de 90 degrés.", answer: "false" },
    { statement: "Le prochain lancer d'une pièce équilibrée sera Pile.", answer: "unknown" },
    { statement: "Si X est plus grand que Y, et Y est plus grand que Z, alors Z est plus grand que X.", answer: "false" },
    { statement: "Dans un groupe de 3 personnes, au moins deux sont nées le même jour de la semaine.", answer: "unknown" },
    { statement: "Un nombre entier peut être à la fois pair et impair.", answer: "false" },
    { statement: "Si il pleut, le sol est mouillé. Le sol est mouillé, donc il a plu.", answer: "unknown" },
    { statement: "Le double d'un nombre impair est toujours un nombre pair.", answer: "true" },
    { statement: "Si Alice parle plus fort que Bob, alors Bob parle moins fort qu'Alice.", answer: "true" },
    { statement: "Une boîte contient 10 billes. Si j'en tire une, elle sera forcément rouge.", answer: "unknown" }
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
    { event: "Construction d'une Maison", steps: ["Fondations", "Murs", "Charpente", "Toiture", "Finition"] },
    { event: "Préparation d'un Repas", steps: ["Faim", "Choix des ingrédients", "Cuisine", "Dressage", "Dégustation"] },
    { event: "Processus d'Apprentissage", steps: ["Incompréhension", "Effort", "Pratique", "Compréhension", "Maîtrise"] },
    { event: "Cycle d'un Projet", steps: ["Idée", "Planification", "Action", "Finalisation", "Résultat"] },
    { event: "Logique d'un Voyage", steps: ["Destination", "Bagages", "Départ", "Trajet", "Arrivée"] }
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

export const RECALL_WORDS: string[] = [
    "soleil", "forêt", "océan", "crypto", "nuage", "montagne", "rivière", "château",
    "étoile", "jardin", "tempête", "silence", "flamme", "horizon", "mystère", "voyage",
    "rêve", "lumière", "ombre", "parfum", "mélodie", "chemin", "aurore", "crépuscule"
];

export const CONSTRAINTS_DATA: ConstraintsData[] = [
    {
        words: ["soleil", "mystère", "courir"],
        validPhrases: [
            "Le soleil cache un mystère que je veux découvrir en courant",
            "Je cours vers le mystère du soleil couchant"
        ],
        invalidPhrases: [
            "La lune brille dans la nuit étoilée",
            "Courir mystère soleil dans le vide"
        ]
    },
    {
        words: ["temps", "sable", "main"],
        validPhrases: [
            "Le temps file comme le sable entre mes mains",
            "Dans ma main, le sable du temps s'écoule"
        ],
        invalidPhrases: [
            "L'horloge marque les heures qui passent",
            "Main sable temps couler vite"
        ]
    },
    {
        words: ["silence", "étoile", "rêver"],
        validPhrases: [
            "Dans le silence de la nuit, je rêve aux étoiles",
            "Les étoiles rêvent en silence"
        ],
        invalidPhrases: [
            "Le bruit de la ville m'empêche de dormir",
            "Étoile silence rêver nuit"
        ]
    }
];

export const RESOURCES_DATA: ResourcesData[] = [
    {
        scenario: "Lancement produit",
        budget: 100,
        time: 10,
        objectives: [
            { name: "Marketing viral", budgetCost: 40, timeCost: 3, value: 35 },
            { name: "Améliorer produit", budgetCost: 30, timeCost: 5, value: 40 },
            { name: "Support client", budgetCost: 20, timeCost: 4, value: 25 },
            { name: "Veille concurrence", budgetCost: 15, timeCost: 2, value: 15 }
        ],
        optimalValue: 75
    },
    {
        scenario: "Startup Weekend",
        budget: 50,
        time: 8,
        objectives: [
            { name: "Prototype MVP", budgetCost: 20, timeCost: 4, value: 45 },
            { name: "Pitch deck", budgetCost: 10, timeCost: 3, value: 30 },
            { name: "Étude marché", budgetCost: 15, timeCost: 2, value: 20 },
            { name: "Networking", budgetCost: 10, timeCost: 2, value: 15 }
        ],
        optimalValue: 80
    },
    {
        scenario: "Événement annuel",
        budget: 80,
        time: 12,
        objectives: [
            { name: "Réserver salle", budgetCost: 35, timeCost: 2, value: 30 },
            { name: "Inviter speakers", budgetCost: 25, timeCost: 4, value: 40 },
            { name: "Catering premium", budgetCost: 30, timeCost: 3, value: 25 },
            { name: "Goodies", budgetCost: 15, timeCost: 2, value: 10 }
        ],
        optimalValue: 85
    }
];
