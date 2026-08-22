const CategoryModel = require("../models/categoryModel")
const DeckModel = require("../models/deckModel")
const FavoriteModel = require("../models/favoriteModel")
const VocabularyModel = require("../models/vocabularyModel")

exports.listHome = async(req, res, next) => {
    try {
        const userId = req.session.userId
        
        const [categories, totalCategory, decks, totalDeck, totalVocabulary, favorites] = await Promise.all([
            CategoryModel.findAllByUserId(userId, 8),
            CategoryModel.countCategory(userId),
            DeckModel.findAllByUserId(userId, 8),
            DeckModel.countDeck(userId),
            VocabularyModel.countVocabulary(userId),
            FavoriteModel.findAllByUserId(userId)
        ])
        
        res.status(200).json({ 
            summary: { totalCategory, totalDeck, totalVocabulary }, 
            categories, 
            decks, 
            favorites
        })
    } catch (error) {
        console.error(error)
        next(error)
    }

}