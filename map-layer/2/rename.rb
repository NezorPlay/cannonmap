tile_width = 256
tile_height = 256
image_width = 4992
image_height = 3072
n = 0
# To get this number, look at the number of tiles 
# generated, find the last tile number and add 1
# e.g. tiles_99.png => total_tiles = 100
total_tiles = 240

tiles_per_column = 20

row = 0
column = 0
(n...total_tiles).each do |i|
  filename = "tiles_#{i}.png" # current filename
  target = "map_#{column}_#{row}.png" # new filename

  puts "copy #{filename} to #{target}" 

  `cp -f #{filename} #{target}` # rename

  # work out next step
  column = column + 1
  if column >= tiles_per_column
    column = 0
    row = row + 1
  end
end
