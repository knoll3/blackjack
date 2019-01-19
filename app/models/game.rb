class Game < ApplicationRecord
	has_many :cards
	after_create :populate_deck

	def populate_deck
		suits = ["hearts", "diamonds", "spades", "clubs"]
		ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]
		suits.each do |suit|
			ranks.each do|rank|
				cards.create(rank: rank, suit: suit, held_by: "deck")
			end
		end
	end

end
