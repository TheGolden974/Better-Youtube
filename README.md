# Better YouTube

Une extension qui transforme l'interface YouTube avec un design moderne inspiré du style "liquid glass" d'Apple, tout en ajoutant des fonctionnalités de filtrage améliorées.

## ✨ Fonctionnalités

### 🎨 Interface Redesignée
- **Style Liquid Glass** : Interface moderne avec effets de verre liquide inspirés d'Apple
- **Barre de recherche dynamique** : Animation fluide et design du nouveau Finder macOS 26
- **Transparence et flou** : Effets visuels sophistiqués avec backdrop-filter
- **Animations fluides** : Transitions et micro-interactions soignées

### 🔧 Améliorations Fonctionnelles
- **Filtres personnalisés** : Boutons "Tout", "Vidéo", "Short" avec style liquid glass
- **Interface épurée** : Masque les boutons "Télécharger" et "Créer" indésirables
- **Navigation améliorée** : Filtrage intelligent entre vidéos longues et Shorts
- **Responsive** : S'adapte automatiquement aux changements de page YouTube

## 🚀 Installation

### Prérequis
- Extension **Enhancer for YouTube** installée dans votre navigateur
- Navigateur supportant les effets backdrop-filter (Chrome, Firefox, Safari récents)

### Étapes d'installation

1. **Installer Enhancer for YouTube**
   ```
   Chrome Web Store → Rechercher "Enhancer for YouTube" → Installer
   ```

2. **Accéder aux paramètres**
   - Aller sur YouTube
   - Cliquer sur l'icône Enhancer for YouTube dans la barre d'outils
   - Sélectionner "Settings" / "Paramètres"

3. **Ajouter le CSS personnalisé**
   - Dans les paramètres, aller à l'onglet "Appearance" / "Apparence"
   - Trouver la section "Custom CSS"
   - Copier-coller le contenu du fichier `style.css`

4. **Ajouter le JavaScript personnalisé**
   - Aller à l'onglet "Advanced" / "Avancé"
   - Trouver la section "Custom JavaScript" ou "User Script"
   - Copier-coller le contenu du fichier `script.js`

5. **Sauvegarder et actualiser**
   - Cliquer sur "Save" / "Sauvegarder"
   - Actualiser la page YouTube

## 🎯 Ce qui est modifié

### Interface Visuelle
- **Barre de navigation** : Style liquid glass avec transparence et flou
- **Boutons de filtre** : Design moderne avec effets de survol fluides
- **Barre de recherche** : Animation d'ouverture dynamique avec backdrop blur
- **Éléments UI** : Coins arrondis, ombres douces, effets de profondeur

### Fonctionnalités Cachées
- Bouton "Télécharger" sous les vidéos
- Bouton "Créer" dans la barre de navigation
- Filtres originaux YouTube (remplacés par les nôtres)

### Nouveau Système de Filtres
- **Tout** : Affiche tous les contenus (vidéos + Shorts)
- **Vidéo** : Affiche uniquement les vidéos longues
- **Short** : Affiche uniquement les YouTube Shorts

## 🛠 Personnalisation

### Modifier les couleurs
Éditez les variables CSS dans `style.css` :
```css
:root {
  --liquid-primary: rgba(0, 122, 255, 0.8);
  --liquid-secondary: rgba(255, 255, 255, 0.1);
  --blur-strength: blur(20px);
}
```

### Ajuster les effets
- `backdrop-filter: blur()` : Intensité du flou
- `background: rgba()` : Transparence des éléments
- `transition: all 0.3s ease` : Vitesse des animations

## 🔧 Dépannage

### Le script ne fonctionne pas
1. Vérifiez que Enhancer for YouTube est activé
2. Actualisez la page YouTube après avoir ajouté le code
3. Ouvrez la console développeur (F12) pour voir les erreurs

### Les effets visuels ne s'affichent pas
1. Vérifiez que votre navigateur supporte `backdrop-filter`
2. Désactivez temporairement les autres extensions YouTube
3. Testez en mode navigation privée

### Les filtres ne fonctionnent pas
- Attendez quelques secondes après le chargement de la page
- Le script s'adapte automatiquement aux changements de page YouTube

## 📝 Notes

- Compatible avec le mode sombre et clair de YouTube
- Fonctionne sur toutes les pages YouTube (accueil, tendances, abonnements)
- Les paramètres sont conservés pendant la navigation
- Mise à jour automatique lors des changements de page YouTube SPA

## 🆕 Versions

### v1.0
- Interface liquid glass complète
- Système de filtres personnalisés
- Barre de recherche dynamique
- Masquage des éléments indésirables

---

*Inspiré par le design system d'Apple et optimisé pour une expérience YouTube moderne et épurée.*
