class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
    	t.string :rank
    	t.string :suit
    	t.string :held_by
    	t.integer :game_id	
      t.timestamps
    end

    add_index :cards, :game_id
  end
end
