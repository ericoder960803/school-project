

import kaboom from "kaboom"


const k = kaboom()
setBackground(141, 183, 255)
const chineseFont = k.loadFont("chineseFont","fonts/Cubic_11_1.010_R.ttf");
//k.loadSprite("bena", "sprites/bean.png")

function addButton(txt, p, f) {
    const btn = add([
        rect(240, 80, { radius: 8 }),
        pos(p),
        area(),
        scale(1),
        anchor("center"),
        outline(4),
    ])

    btn.add([
        text(txt,{ font: chineseFont, size: 30 ,width:width(),align: "center", wordwrap: false}),
        anchor("center"),
        color(0, 0, 0),
    ])

    btn.onHoverUpdate(() => {
        const t = time() * 10
        btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
        btn.scale = vec2(1.2)
        setCursor("pointer")
    })

    btn.onHoverEnd(() => {
        btn.scale = vec2(1)
        btn.color = rgb()
    })

    btn.onClick(f)

    return btn
}

let textSize =30
function add_the_text(txt, p ){
    let position=p
    const textObject=add([
        text(txt,{ font: chineseFont, size: textSize ,width:width(),align: "center", wordwrap: false}),
        anchor("center"),
        
        color(255, 255, 255),
        pos(position),
    ])
    position.x += textObject.width + 10;

  // 判断是否需要换行
  //if(position.x + textObject.width > width()) {
    //position.x = 0;
    //position.y += textSize + 10;
    
  //}

    return textObject
}

scene("intro-animation", () => {
    setBackground(0, 0, 0)
    // 在這裡定義 "start" 場景的內容
   //逐字出現 
   //const text = "20xx年，人類丟棄多的垃圾導致問題，身為勇者的你，請解決他"
   const words = "20xx年，人類丟棄多的垃圾導致問題，身為勇者的你，請解決他".split("");
 
   let i = 0;
 
   loop( 1,() => {
 
     if(i < words.length) {
       let pos=vec2(width()/4+i*textSize, height()*0.4)
       const word = add_the_text(words[i],pos );
	   
 
       word.alpha=0;
	   
       //wait(30, () => {
        //word.alpha = 1; 
      //}).then(()=>go("battle"));
       

      i++;
    } 
	add_the_text("按方向鍵上以skip",vec2(width()/2,height()/2))
	onKeyPress("up",()=>{
		go("battle")
	})})
    //go("nextScene")
    
    debug.log("Start Scene");
});

scene("gamestart", () => {
	onKeyPress("up", () => {
		go("battle")
	})
    addButton("開始", vec2(width() / 2, height() * 0.4), () => go("intro-animation"))
    addButton("Quit", vec2(width() / 2, height() * 0.6), () => debug.log("bye"))
});


    


const objs = [
	
	"junk",
	"wheel",
	"junk-garbage",
	"bag",
	"bb",
	"garbage",
	"gray-junk"
]

for (const obj of objs) {
	loadSprite(obj, `sprites/${obj}.jpg`)    
}

//loadBean()
loadSprite("player","/sprites/PlayerSheet.jpg ")
loadSprite("apple","/sprites/apple.jpg")
loadSprite("foot","sprites/foot.jpg")
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("shoot", "/examples/sounds/shoot.mp3")
loadSound("explode", "/examples/sounds/explode.mp3")
loadSound("OtherworldlyFoe", "/examples/sounds/OtherworldlyFoe.mp3")

scene("battle", () => {
	setBackground(141, 183, 255)
    
	const BULLET_SPEED = 1200
	const TRASH_SPEED = 120
	const BOSS_SPEED = 48
	const PLAYER_SPEED = 480
	const STAR_SPEED = 120
	const BOSS_HEALTH = 1000
	const OBJ_HEALTH = 4
	human_health=3

	const bossName = choose(objs)

	let insaneMode = false

	const music = play("OtherworldlyFoe")

	volume(0.5)

	function grow(rate) {
		return {
			update() {
				const n = rate * dt()
				this.scale.x += n
				this.scale.y += n
			},
		}
	}

	function late(t) {
		let timer = 0
		return {
			add() {
				this.hidden = true
			},
			update() {
				timer += dt()
				if (timer >= t) {
					this.hidden = false
				}
			},
		}
	}

	add([
		text("KILL", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(1),
		fixed(),
	])

	add([
		text("THE", { size: 80 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(2),
		late(1),
		fixed(),
	])

	add([
		text(bossName.toUpperCase(), { size: 120 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(4),
		late(2),
		fixed(),
	])
	add([
		sprite("foot"),
		scale(0.3,0.3),
		pos(5, 50),
		fixed(),
		
		
		
	])

	const sky = add([
		rect(width(), height()),
		color(0, 0, 0),
		opacity(0),
	])

	sky.onUpdate(() => {
		if (insaneMode) {
			const t = time() * 10
			sky.color.r = wave(127, 255, t)
			sky.color.g = wave(127, 255, t + 1)
			sky.color.b = wave(127, 255, t + 2)
			sky.opacity = 1
		} else {
			sky.color = rgb(0, 0, 0)
			sky.opacity = 0
		}
	})

	// 	add([
	// 		sprite("stars"),
	// 		scale(width() / 240, height() / 240),
	// 		pos(0, 0),
	// 		"stars",
	// 	])

	// 	add([
	// 		sprite("stars"),
	// 		scale(width() / 240, height() / 240),
	// 		pos(0, -height()),
	// 		"stars",
	// 	])

	// 	onUpdate("stars", (r) => {
	// 		r.move(0, STAR_SPEED * (insaneMode ? 10 : 1))
	// 		if (r.pos.y >= height()) {
	// 			r.pos.y -= height() * 2
	// 		}
	// 	})

	const player = add([
		sprite("player"),
		scale(5,5),
		area(),
		pos(width() / 2, height() - 64),
		health(human_health),
		anchor("center"),
	])
	const human_healthbar = add([
		rect(width()/8, 24),
		pos(0, 145),
		color(107, 201, 108),
		//fixed(),
		{
			max: human_health,
			set(hp) {
				this.width = width()/7 * hp / this.max
				this.flash = true
			},
		},
	])

	human_healthbar.onUpdate(() => {
		if (human_healthbar.flash) {
			human_healthbar.color = rgb(107, 201, 108)
			human_healthbar.flash = false
		} else {
			human_healthbar.color = rgb(107, 201, 108)
		}
	})

	onKeyDown("left", () => {
		
		player.move(-PLAYER_SPEED, 0)
		if (player.pos.x < 0) {
			player.pos.x = width()
		}
		
	})

	onKeyDown("right", () => {
		player.move(PLAYER_SPEED, 0)
		if (player.pos.x > width()) {
			player.pos.x = 0
		}
	})

	onKeyPress("up", () => {
		insaneMode = true
		music.speed = 2
	})

	onKeyRelease("up", () => {
		insaneMode = false
		music.speed = 1
	})

	player.onCollide("enemy", (e) => {
		debug.log(e)
		destroy(e)
		player.hurt()
		//shake(120)
		play("explode")
		//music.detune = -1200
		music.paused=true
		//addExplode(center(), 2, 120, 30)
		wait(0.3, () => {
			music.paused = false
			//go("battle")
		})
	})
	player.onCollide("apple",(e)=>{
		 
		destroy(e)
		player.heal(1)
		human_healthbar.set(player.hp())
		
	})
	player.onHurt(()=>{
		shake(20)
      human_healthbar.set(player.hp())
	})
	player.onDeath(()=>{
		music.detune = -1200
		wait(0.3, () => {
			music.paused = true
			go("battle")
		})
	}
	)

	function addExplode(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(4, 4),
						scale(1 * size, 1 * size),
						lifespan(0.1),
						grow(rand(48, 72) * size),
						anchor("center"),
					])
				}
			})
		}
	}

	function spawnBullet(p) {
		add([
			rect(12, 48),
			area(),
			pos(p),
			anchor("center"),
			color(127, 127, 255),
			outline(4),
			move(UP, BULLET_SPEED),
			offscreen({ destroy: true }),
			// strings here means a tag
			"bullet",
		])
	}

	onUpdate("bullet", (b) => {
		if (insaneMode) {
			b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255))
		}
	})

	onKeyPress("space", () => {
		spawnBullet(player.pos.sub(16, 0))
		spawnBullet(player.pos.add(16, 0))
		play("shoot", {
			volume: 0.3,
			detune: rand(-1200, 1200),
		})
	})
    
	function spawnTrash() {
		const name = choose(objs.filter(n => n != bossName))
		add([
			sprite(name),
			area(),
			pos(rand(0, width()), 0),
			scale(2),
			health(OBJ_HEALTH),
			anchor("bot"),
			"trash",
			"enemy",
			{ speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
		])
		wait(insaneMode ? 0.1 : 0.3, spawnTrash)
	}

	const boss = add([
		sprite(bossName),
		area(),
		pos(width() / 2, 40),
		health(BOSS_HEALTH),
		scale(3),
		anchor("top"),
		"enemy",
		{
			dir: 1,
		},
	])
    let item=[0,0,1]
	on("death", "enemy", (e) => {
        
		if(choose(item)==1){
			add([
				sprite("apple"),
				pos(e.pos.x,e.pos.y),
				move(DOWN,BULLET_SPEED/2),
				area(),
				"item",
				"apple"
			]

			)
		}
		destroy(e)
		shake(2)
		//addKaboom(e.pos)
	})
	onUpdate("item",(i)=>{
		if (i.pos.y - i.height > height()) {
			destroy(i)
		}
	})

	on("hurt", "enemy", (e) => {
		shake(1)
		play("hit", {
			detune: rand(-1200, 1200),
			speed: rand(0.2, 2),
		})
	})

	const timer = add([
		text(0),
		pos(12, 32),
		fixed(),
		{ time: 0 },
	])

	timer.onUpdate(() => {
		timer.time += dt()
		timer.text = timer.time.toFixed(2)
	})

	onCollide("bullet", "enemy", (b, e) => {
		destroy(b)
		e.hurt(insaneMode ? 10 : 1)
		//addExplode(b.pos, 1, 24, 1)
	})

	onUpdate("trash", (t) => {

		t.move(0, t.speed * (insaneMode ? 5 : 1))
		rotate(dt())
		if (t.pos.y - t.height > height()) {
			destroy(t)
		}
	})

	boss.onUpdate((p) => {
		boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0)
		if (boss.dir === 1 && boss.pos.x >= width() - 20) {
			boss.dir = -1
		}
		if (boss.dir === -1 && boss.pos.x <= 20) {
			boss.dir = 1
		}
	})

	boss.onHurt(() => {
		healthbar.set(boss.hp())
	})

	boss.onDeath(() => {
		music.stop()
		go("win", {
			time: timer.time,
			boss: bossName,
		})
	})

	const healthbar = add([
		rect(width(), 24),
		pos(0, 0),
		color(240, 32, 34),
		fixed(),
		{
			max: BOSS_HEALTH,
			set(hp) {
				this.width = width() * hp / this.max
				this.flash = true
			},
		},
	])

	healthbar.onUpdate(() => {
		if (healthbar.flash) {
			healthbar.color = rgb(107, 201, 108)
			healthbar.flash = false
		} else {
			healthbar.color = rgb(127, 0, 0)
		}
	})

	add([
		text("UP: insane mode", { width: width() / 2, size: 32 }),
		anchor("botleft"),
		pos(24, height() - 24),
	])

	spawnTrash()

})

scene("win", ({ time, boss }) => {

	const b = burp({
		loop: true,
	})

	loop(0.5, () => {
		b.detune = rand(-1200, 1200)
	})

	add([
		sprite(boss),
		color(255, 0, 0),
		anchor("center"),
		scale(8),
		pos(width() / 2, height() / 2),
	])

	add([
		text(time.toFixed(2), 24),
		anchor("center"),
		pos(width() / 2, height() / 2),
	])

})



// 啟動 "gamestart" 屏幕
k.go("gamestart");

k.onClick(() => k.addKaboom(k.mousePos()))
