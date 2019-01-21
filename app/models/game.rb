class Game < ApplicationRecord
	has_many :cards
	after_create :populate_deck

	def populate_deck
		suits = ["hearts", "diamonds", "spades", "clubs"]
		ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]
		deck = []	

		2.times do 
			suits.each do |suit|
				ranks.each do|rank|
					deck << {rank: rank, suit: suit, held_by: "deck", face_up: true}
				end
			end
		end

		deck.shuffle!
		deck.each do |card|
			cards.create(rank: card[:rank], suit: card[:suit], held_by: card[:held_by], face_up: card[:face_up])
		end
	end
end
