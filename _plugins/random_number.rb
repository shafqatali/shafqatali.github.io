module Jekyll
  module RandomNumber
    def random(text)
      @rand_number = rand(1000)
      text.sub(%r{\[x\]}i, @rand_number.to_s)
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomNumber)