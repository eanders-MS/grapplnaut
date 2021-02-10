namespace SpriteKind {
    export const Thing = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    checkStartGrappling()
})
function toRadians (num: number) {
    return num * Math.PI / 180
}
function updatePlayerSprite () {
    if (direction_x < 0) {
        naut.setImage(naut_rev_img)
    } else {
        naut.setImage(naut_img)
    }
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    checkStopGrappling()
})
function updateGrappling () {
    if (grappling) {
        reelUp()
        swing()
        layoutDots()
    }
}
function reelUp () {
    if (anchored) {
        _dist_y = naut.y - hook.y
        _step_y = Math.min(_dist_y, reel_step)
        naut.y = naut.y - _step_y
    }
}
function swing () {
    if (anchored) {
        _t = (game.runtime() - anchor_time) * swing_speed / 1000 % 360
        _dist_y = hook.y - naut.y
        _dist_x = naut.x - hook.x
        if (Math.abs(_dist_y) <= naut.height / 3) {
            _cos_t = 0
        } else {
            _cos_t = Math.cos(toRadians(_t))
        }
        _amp = Math.abs(anchor_dist_x) * (-1 * sign(anchor_dist_x)) * _cos_t * (_dist_y / anchor_dist_y)
        _prev_x = naut.x
        naut.x = hook.x + _amp
        if (_prev_x <= naut.x) {
            direction_x = 1
        } else {
            direction_x = -1
        }
    }
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (sprite == hook) {
        anchored = true
        anchor_time = game.runtime()
        anchor_dist_x = hook.x - naut.x
        anchor_dist_y = hook.y - naut.y
        anchor_ratio = _dist_y / _dist_x
        anchor_dir_x = direction_x
        hook.startEffect(effects.ashes, 50)
        hook.setVelocity(0, 0)
        naut.ax = 0
        naut.ay = 0
        naut.vx = 0
        naut.vy = 0
    }
})
function checkStopGrappling () {
    if (grappling) {
        grappling = false
        anchored = false
        naut.ay = g
        hook.destroy()
        for (let value of dots) {
            value.destroy()
        }
        attach.destroy()
    }
}
function checkStartGrappling () {
    if (!(grappling)) {
        grappling = true
        hook = sprites.createProjectileFromSprite(hook_img, naut, hook_vx * direction_x, hook_vy)
        hook.setFlag(SpriteFlag.DestroyOnWall, false)
        hook.setFlag(SpriteFlag.AutoDestroy, false)
        dots = []
        for (let index = 0; index < 10; index++) {
            dots.unshift(sprites.create(dot_img, SpriteKind.Thing))
        }
        attach = sprites.create(img`
            . 
            `, SpriteKind.Player)
        attach.setPosition(naut.x, naut.y)
        layoutDots()
    }
}
function layoutDots () {
    _dist_x = hook.x - naut.x
    _dist_y = hook.y - naut.y
    _step_x = _dist_x / (dots.length + 1)
    _step_y = _dist_y / (dots.length + 1)
    _dot_x = _step_x
    _dot_y = _step_y
    for (let value2 of dots) {
        value2.setPosition(naut.x + _dot_x, naut.y + _dot_y)
        _dot_x += _step_x
        _dot_y += _step_y
    }
}
function sign (num: number) {
    if (num < 0) {
        return -1
    }
    return 1
}
let _dot_y = 0
let _dot_x = 0
let _step_x = 0
let attach: Sprite = null
let dots: Sprite[] = []
let anchor_dir_x = 0
let anchor_ratio = 0
let _prev_x = 0
let anchor_dist_y = 0
let anchor_dist_x = 0
let _amp = 0
let _cos_t = 0
let _dist_x = 0
let anchor_time = 0
let _t = 0
let _step_y = 0
let hook: Sprite = null
let _dist_y = 0
let anchored = false
let grappling = false
let naut: Sprite = null
let naut_rev_img: Image = null
let naut_img: Image = null
let hook_img: Image = null
let dot_img: Image = null
let swing_speed = 0
let g = 0
let reel_step = 0
let hook_vy = 0
let hook_vx = 0
let direction_x = 0
direction_x = 1
hook_vx = 400
hook_vy = -1000
reel_step = 1.5
g = 400
swing_speed = 400
dot_img = img`
    1 1 
    1 1 
    `
hook_img = img`
    1 1 1 1 1 1 
    1 1 1 1 1 1 
    . . 1 1 . . 
    . . 1 1 . . 
    `
naut_img = img`
    . . . . . . . . . . . . . . . . 
    . . . . . f f f f f f . . . . . 
    . . . . f 1 1 1 1 1 1 f . . . . 
    . . . f 1 . 3 3 3 . . 1 f . . . 
    . . f 1 . 3 3 3 3 3 3 . 1 f . . 
    . . f 1 . 3 3 3 8 8 8 3 1 f . . 
    . . f 1 3 3 3 3 8 1 8 3 1 f . . 
    . . f 1 3 3 3 3 8 8 3 3 1 f . . 
    . . f 1 3 3 3 3 3 3 3 3 1 3 f . 
    . f 3 3 1 3 3 3 c c c 1 3 3 3 f 
    f 3 3 3 3 1 1 1 1 1 1 3 3 f 3 f 
    f 3 f 3 3 3 3 3 3 3 3 3 3 f f . 
    . f f 3 3 3 3 3 3 3 3 3 3 f . . 
    . . . f 3 3 3 3 3 3 3 3 f . . . 
    . . . . f 3 f f f f f 3 3 f . . 
    . . . . . f . . . . . f f . . . 
    `
naut_rev_img = naut_img.clone()
naut_rev_img.flipX()
tiles.setTilemap(tilemap`level_0`)
scene.setBackgroundImage(img`
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccccccbcccccccccbccccccccccccccccccccccccccccccbccbcccbccccccccbccccccccbccccccccccccccccccccccbcccccbccccccccccccccccbcccccccccccccccccccccccccccccc
    ccbccccccbccccbccccccccccccccccccccccccccccccccccccbcccccccccccccccccccbccccbccccccccccccccccbcccccccccbccccccccccccbccccbcccccccccccccccccccbcccccccbcccbcccccc
    cccccccbcccccccccccccccbcccccbccccccbccccccccbccccccccccccccccccccccccccccccccccccccccbcccbccccccbcccccccccccccccccccccccccccccccccccccccccccccccbcccccccccccbcc
    cccccccccccccccccccccccccccccccccccbccccbcccccccccccbccccccccccccccccccccccccccccccccccccccccccccccccccccccccbccccccccccccccbcccccccccbccccbcccccccccccccccccccc
    cccccccbcccccbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccccbccccccccccccccccccccccccccccccccccccccbccccccccccccccccccccccccccbcccccc
    ccbccccccccccccccbccccccbccccbcccbcccccbccccccccccccccccccbccccccbccccccccccccccccccccccccccbccccccccccccbcccccccbcccccccbcccccccbcccccccbcccccccccccccccccccbcc
    ccccccccccbccccccccccbcccccccccccccccccccbcccbccccbccbccccccccccccccbccccccccbcccccccccccccccccccccccccbccccccccccccccccccccccccccccccbccccccccbbccccccccccccccc
    ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccccccccccbccccccccccccccccccbccccbcccccccccccccbccccccccbccccccccccccccccccccccccccccccbccccccccc
    ccccccccccccccccccccbccccccccccccccccccccccccbccccccccccccccccccccccbccccccccccccbcccbccccccccccccccccccbcccbcccbcccccccccccbbcccccccccccccccccccbcccbccccbccccc
    ccccccccccbcccbccccbccccbcccccccccccbcccccccccbccccbcccbcccccbbcbcccccccbccccbcccbcccccccbccccccbbccccbccbccccbccccccbccccccccccccccbcccccbcccccccccbcccccccccbc
    cccbcccccccccccccccccbcccccccccccccbbcccccccccccbcccccccccbbccccccccccbcccccccccccccccbcccccccbcccccccbcccccccccccccccbcccbcccccbccbccccbccccccccccccccccccbcccb
    bcccbcbcbccccccbcccbccccccbcbbccbccccccccbcbccccccccbcccccccccccccbcccccccbccbccccccccccbccccccbcccccccccccccccccccbcccccccbccccccccccbcccccbcbccccbcccccccccccc
    ccccbccccccccccbcccccccccccbccccccbccccbcbcccccccccccbccccccccccccbcbccccccccbcccccbcccccccccccccccccccccbcccccccccccccbccccccccccccbccccbcccccccccccccccbcccccc
    cbbcbccccccbccccccbccbccccccbcbcccbcccccccccbccbcbcccccccbccccbccbcccbccccbccccccbcccbccbcbcbcccccccccccbccccccccbccbcccccbccccccbbccccccccccbcccccbcbcccccccbcc
    ccccccccccccccbcccccbccccccccccccccccccccbcccccccccccccbccccccccccccccccccccccbcccccbcccccccccccccccccbccccccbcccccccccccccbcbcccccccccccccccccbcccbcccbcbccbccc
    cccccccccccbccccccbcccccbcccccccccccbcccccccccccbcccccccccbccbcccccccccccbccccccccccccccccccccbcbccbcbccccccccbcccbcccccccccbcccccccccbccbcccccccccccccccccccccc
    cbcbcbccbcccccbcccbbcccccccccccbccccccbccbcbcbccccccccccccccbccccbcccccbccccbccccbccccbccccccccccccccccbbccccbcbccccbccccccccbcccbccccccbcccccccccbbccccccccbccc
    ccccbcbccbccccccccbcccbccccccbcccbcbccccccccccbbcbbcccbcbcccccbcccccbbccbcbcccccbccccbcccbcbcbccbbcccbcccbccccccccbccbcccccbccbcccccbcccccbccbccccccbccccbbccccc
    ccbcccccccccccccccccbcbccbcbccccccbccccccbccccccccbcccccbccccccccbcbccccccccbccccccbcccbccbcccbcccccccccccccccccccbccccccbbcccbccbccccbcbcccccbcbccccccbccbcbbcc
    ccccccccbcccbcbccccccccccccbbcccccccbbccccccccccccccbcbcccbcbcccccccccccccbcccbcccccccccccccccbcbcccccbccccbcccbbcccccbccccccccccccbccbccccccbccccccccbccccccccc
    cbccccccccccbccccccccccccccccccbbbbcccccccccccbccbccccbccccccbcccccbbccccbcccbcccbccccbbcccccbcccbccbcbcccccccbccccccccccccccccbccbccbccccccbcbcccccccccccccbccc
    bcccbbccbcccccccbcbbccccccbcccbccccccbbcccccbccbccccccbccbbccccccccccccccccccbcccbccbccccccbbccbbbccbccccccbcbcccccbbccbcccbcbccccccbcccccccccccbccccbbbccbccccc
    ccccccbccccccccbccccbbccbccccccbccccccccccbbccccccbbccccbcccccbcbccccbcbccbcccccccbccccccbccccccccccccccccbcccbcccbbcccccccbcbccccbccbccbccccbccccccccccbcbccccc
    cbcccccccbbcccbccccccbcccccbccccccccbccccbccccccccccbccccccccccbccbccccccbcccccbccccccccccbccccccccccccccbccccccccccbccccbccccccccbcccccbccbcccccbbccccccccccbbc
    cbcccbccbcccccbccccccccbccbccbcccccbcbccccbccccbccbbbbccccccccccccbccccccbbccccccccbbccbcccccccccbccbcccccccbccbccccccbccbccccccbccbbccccbbcbccccccccccbbbccccbc
    bcbccccccccccbcccbbccbcccccbcccbcccbcbccbbccbcbcccccccbccbcbccbccccbcbccccccbcccccbccccbcbbbbccccbccccbbcbbcccccccbcccccccbcbbcbccccbccccbcccccccbbbccbbcccccccb
    ccbccbbccbcbbbccbbccbccccbcccbccbcbcbccccbccccbcccbcbcccccbcccccccbccbbcccccbcbccccbccbcccccbbccbccbbcccccbccccbbccbccbbcccccccbccbccccccbccccccccccccbccbccbccc
    cccccbccbcccccccccccccbccbccbccccccccbcccccccccccbccccccccbccbbbcccbccbcbbccccbcbccccccccccbccbccccccccccbccbccccccbcccbbccbcccccbcccbcbccccbbbcccbcccccbccccccb
    cccbcccbcccccbcbccbcbcccccccbbcccccccbbcbbcccccbccbcccccccccbccccccccccccccccccbbbcccccccccbcbcbccbccbcbccccbcccbccbcbccbccccbbcccbccbcbccccbbccbcccbbcccccccccc
    bccbccccbcbcccccccccbccccccbcbbccbcccbcccbcccccbbccccbccccbbccbbbbccbbcbbbcccccccbccbccbccbcccccbcccccbccbcccccbcbcbcccccccbcbcccccbcccccccbbbcccccccbccbccccbcc
    ccccccbbbccbcbccbcccbcccbbccccccbccbcccccccbbcccccccbccccbcbcbcccbbcbcccbcbcccbcccccccbbbccccccbcccccccbcccccbbccccccbbcbbccccccccbcccbcccbccccccccccccccbbccbcc
    bcccbccccccccccbbcbccbccbcccccccbccccbccccccccbccbcbcbbccccccccccccccccccccccbcbcbccccccccbcbcccbbccccccbcbbcccccccccccbcccccccbccbccbcccbcbccccbcbbcccbcccbcbcb
    cbbcccccbcbccccccccccccccccccbccccbccccbbccccccccccbcbbccbbcbcccccccbccccbccccbbbbcbbbccbccbcccccccccccbccccccccbcccbcbccccccccccccbcbbbbccccbbcccbcccbccbbccbcc
    cbcccbbcbccccbbccbbcbcccbcbbccbcbcbcccccbcccccbbbbcccbccbbccbccbcbcbccbccbbcbcbbbbccccbcbcbcbbcccbccccccbbccbccccbccbcccccbcccbbbcbbcbccbbcccbcccccbcbcbcbccbcbc
    cccbbcbbcccccbbcbbcbcbbcccccccccccccccbbbcccccbcccbcccbcccccbcccccbcbccbcccbccccccccccccccccbbcccbcbbcbccbccccbccbcbccbbbcbccbbcccccccccccbcbccccbbccbccccbccccc
    bcccccccbccbbccccccccbcbcbbccbbbbcbcbbcccbbccbcbcccbbcccbcccccbcbbccccbccbccccccccccccbbbcccbccccbcbccbbccbbbbbccbcccccccbcbcccbcbcccccbcbcccccbbcccccbccccbbbcc
    bccbcbbcbccccbcccbcccccbccbbbbbbbbbcccbccbccccbcbccbcbbccccbccccccbccbcbbbcccbccbccccbcbbcccbbcccbcbcbccccccbccbccbbcbccbcbcccccbcccccbccbbbbcbbccbbcbcbcccbbbcc
    cbbccbbccbbbcccbccbcccbbbbcbccbbbbcccbbcbcbbcbbccbcbcccbbcbccccbbccbcbbcccccbbbbbcbbcccbccccccbccbccbbccbbccbcbccbbcbbcbcccbbcbcccccccbbcccbbcbcbbccbcccbbcccbcc
    ccbcccccccbbbcbbcbcbbbccbccccccccccccbccbcccbccccbccbbccccbbbcbbbccccccbcbcbccccbcbccbbbbcbbbbcccbcccbbccbccccbccbcbcccbcccbbbbccbbbcbcccccbcccbcccbcccbcbbccccb
    bcccbbcccccccbccbccbccbccccccccccbccbbccccbccbcbbcccccbcccbccbbcbcbccbccbbcccccbcccccccccbbcbcccccbbcccbcbbbccbccccccbcccbcbccbcbccbcbbcbccccccccbcccbbcbcccccbb
    cbcbcbcccbbccbcccccbcbbcccccbbbccbbccbcbcbcccbccccbccbbccbccbbcccbcccbccbccbccbccbccbcbbbbbccbccbccccccbbccccbcccbbcbccbbccccbbccbccbbccccbcccccccbbcbcccbcccbcc
    cbcccccbccbbcbcccbbcccbccbbccccbccccbcbcbccccbbcbcbbbccccccbbccbcbbbcccbcbcbcccccbcbccbcccbbcccbbbccccbbbcccccbbbbbccccbbbccccccccbbbccccbccccbbcbcbbcbbbbbcbbcc
    cbcccbccbcccbcbbccbbccbbbccbcbbcbbcbccbcbbccbccccbccbcccccbcbccbccbccccccccccbbbccbcbbcccbccccbbccccbbccbbcbcccccccbcbbcbcbccbbccbccccbbbcbccbbbccbccccbcbbcbbcc
    bcbcbbbccccbcbcccccbcccbbcbcccccbccccccbcbbccbbcccbcbbccbcbbccccbcccbbbbbbccbbccbccbccccccccccbbbbbccbcccccbbbcbccccccbccccbbbccbcbcbccccbcbcccbcbcccbccccccccbc
    bbcbccbbcbcccccccbbbccbbcbbccbcbcbccbccccbcccbccbcccbcccbcbcbbcccbbbbbbbbcccbcbbcbbbbbbbcbcbcbbcbbcccbccbbbccbbccbcccbccbcbcbccccbcbbcbbcbbcbcccbcbbccbbcccccbcb
    ccbbcbbcbcccbcbbccbcccbccbbccbccbbbbccccbccccbcbcbbcbcbcbbcbcbbbccbccccbbcbccbccccbbcccbcbcbcccbbcbbbcbbbccbbcbcbccbbcccbbbbbbccbcbbbcbccbbcbcbccbccbbccbcbccccb
    ccbccbbccbbbccbcbbccbbcccbbcccbbcbcbcbbccbbbbcbcbbcbcbbccbccccbcbccbccbcbcbbbbcbccbbbbccbbccbcbcccbcccbccccccccbcbcbbbbbccccbbbccbccccbccbccbbcccccccbbccbbcbbcc
    cbccbcccbccbbbbcccbccbbcccbcbbccccccbbbbcbbccbbccccbcbcbbccccbcccccbcbcccccbcccccccccccccbccbccbbccccbbccbbcbccbcbbcbccccbcccccbccbccccbbccbcbcbcbbbbccccbbbcbbc
    cbbcbbcccbcbcbcbcbcbccccbbbbbbcbcbbcbbbccbcccbcbbcccccccbccbcbbccbccccbbbcbbcccbcbccbbccbbccccbcccbbbbbccccccbcbbbbbcbccccbbccbccccbcbccbbbbcbcccbbbbcccbbbcbbcc
    bcbccccccccccbbbccbcbcbbcbccccbcbbbccbcbbccbccbbbccbbcbcbbcbcbbccbcbbcccbcbcbbccbbccbbbccccbbccbbccbcbccbbcbbccbcccbcccbcccbccbcccbbbcbccbccbbbcbbbbbbbcccbcbccb
    cbcbbccbbbbccbccbbcccbbbcbcccccbcbcbccbcccbbccbcbcbcbbcbcccccccbbcbbcbbcccbcbcbccbbbcccbcbcccbbbccbbbcbcbcbcbcccccccbbcbbbbcccbbbbbcccbccbccbcbcccccbccbbbbcccbb
    cccbcbbbbcbcccbcbbcccbccccbcbccbcccccbccbcbcbbccbcbcbcbccbcbccbbcbccccbbbcccccbbbcccccbccbbbcccbbcccccbcccbbbcbcbccbccbbcccbcbbbcccbbbbccccbccbcccccbccccccccbcc
    bccbcbbccbcbcbbcccbbccbbbbcbcbccbbcccbbcbbbcbcccbcbcccbbccbbbbcbcbcbcbcbcccbcbccbbcccbcccbbbccbbbbbcbcbbbccbbbbcbbcccbbccbbcbbcbcbccbbbbcbccbcccbcbcccbcbbcccbbc
    bbbcccbbbccccbcbbcccccbbbcccbcbbbccbbccbcbbbcbbbccbbcbbcbbbbccbccbcbcbcbbbbbcbbbbcbcbccbcccbcbbcccbbcbcbbbbbcbcccbbbcbcbcbbccccbbbbcbcbcbcbbbbbcccbbbbbcbbbbcbcb
    cbbccbbcbcbcbcbbbbbcccbcbccbbccbbcccbbcccbccbcbcccbcbbcccccccbbbbccbcbcbcbbccbbcbbbcbbcbbbcbbcbbcbbcbccccbcccbbbbcccbccbcbccbccbccbbcbccbcbbcbbccbccbcbbcccbcccb
    cccbccbbcbbbccbcccbbcbbbcbbcbccbbbcbbcbccccbbccbbbcbbccbcbbcbcccbcbcbbccbccccbbccccbcbcbccbcccbccbcccbbccccbbccccbcbcbcbbcbbbbccccbbbccccccbbcbcbbcbbcccccbcbbcb
    ccbccbccbccbbcbccbcccbcbbbbcbccbcbbcbcccbcbbcbccbbcccbbccccbcbbcccbcbbbcbbbcbbbbbbbbbbbcbccccbcbcccbccbbcbcbcbbccbcbbbbbbbbcbcbbcbcbbccbcbbbccbbbbbcbbccbccbcccc
    bbbbcbcbccbbbcbcbcbcbbbcccbcccbcccbcbcbbbbbccbbccbcbbcbcbbccccbbbbcbbbcbbcbbbcbcccbcbcbcbbcbbcbbbcbbcccbccbbbbcbccbbcccccbbccccbbccbcbbbcbbcbbcbbbcbbbcbbcbcbbbb
    bccccbcbbbcbcbcbbcbcbccccbbcbbccccbbbbbcccccccbbbcbcccbcbcbbcbcbcccccbcccccccccbcccbcbcbbcbbbcccccbbbcbcbbbbcbbcccbbccbccccbbbcbbbcbcbcccbbccbbccbccccbcbbcbbcbb
    bbcccbbbcbccbccbcbbbbcbcccbbbbbcbbbcbcccbbcccbbbbccbbcbbbccbbcbcbbbbcccbcbcbcccbbcbccccbcccbcbcbcbbcbbcbcccccccbccbbbcbbbbccccbcbcccbcbccccbcccbbcccbcbcccbcbccc
    ccbcbbbcbccbcccbbccbcbbbcbcbbcbbbcbbbcbcbcccbcbbbcbccbbccbcbbbbccccbbbbbccccccbbbbccbbcbbcbbcbbccbcbbbbcbcbccbbbcbcbbbcbbbbcccbbcbbcbcbbbccbcbbcbbccbccbbbcbbbbc
    bcbcbcbcbccbbbcbbbccbbcccbcbbcbcccccbcbcbbcbbbbcbbbbccbbbbcbbcccbcbbcccbcbbcbcbbccbbbbbbcccbbbbcccbccbcbbcbbbccbbbbbbbbcccbbbcbbccbbbbccbccbbcbcbbcccbbbcbcbccbc
    bbbbcbbcbcbcbcbcbcbbccbbbbcccbbcbbbccbbcbbbbccbbbcbcbcbbbbbbbbbbcbcbcbbcbbbccbbbcbbbcccbcbbcbcbcbbbccbbbbcbccccbcbbccbcccccbccbbcbbbcbbbbbcbbbcbbbbccbbcccbbcbcb
    bcbccbbcbbbcbbcbcbcbbbccbbbcccbbbcbbbbbccccbccbcccbcccbbccccccbcbbbccbbcbbbbcbccbbccbcccbbbcbbccbcbbcbccbbcccbbbbcccbcbcbbbcccbbbbcccbccbcbcbcbccbbccbcbbccbbbcb
    bcbbbbcbcbcccbbcbbccccbbbbccbcbcbbbcbbbbbcbcbccbbbbbbcccbcbbbccbcbcbccbccbbcbbcbcbcbbcbbcbcccbbbccbbbcbbbbbccccbcccbcbccbcbbbcbcccbbcbbcbbbccbbbbbbbcbcccbbccbbb
    bcbccbcbcbbbbcccbcccbbcbbcbcbbbbbccbcbbcbccbbcbcbbbbcbcbcccbcbbbcbbbbbbbbbbbbbcbbbbcbccbbcbbbbcbbbbbbcbbccbcccbccbbbbbbbcbbccbccbccbbccbcbbbbcbcccbcbccbbbbbbbbc
    bcbccbcccbbbcbbbbbbbccccbbcbbbccbbbcccbcbbbcbbcbccbcbbcbbcbbbbbcbcbccbbbcbbcccbcccbbccbbbbbbccbccbcccbbbcbbcbbbbbbcbccbcccbbbbbbbbcbccbcccbccbbbccbbcbbbccbccbcb
    bccbbcbbbcbccbbbcbcbbbbbcbbccccbccbcbccbbccbbcbcccccbbbcccbbcccbcbcbccbcbcccbccbbccbbcbcccbccbbcccbbcccccbbbbbbccbbcbbcbcbcbbcbcbbccbbbbcbbccbcccbbcbbbcbccbccbc
    bcbbbbcbbcccbbbccbbbbbcccbcbbbbcbcccbbccbcbbbbbccbccbbbbbbbbccccbbbbccbbbbcbcbbbbcbccbcbbbcbcccbbbccbcbbbcbccbbbbccbbccbbbcbcbcbccbbccbbcbcbbbbbbbbbbccbbbbcbcbc
    bbbbbcbbccbbbccbbbbcbbbbcbbcbbccbbbbbbccbbccbbbbbbbbccbcccbcbcbbbcbbbbcbccbbbbbcbbbbbccbcbbbbbbcbbcbbbbbbbbbbcbbcbcbbbbcbbcbbbbbccbbcbbbbbccbcbcbbcbbcbcbcbccbcb
    ccccbcccbbbbbcbccccbccbcbcbcbbcbbbbcccbbcbbcccbcbbbbbbcbcbbcbbcbcccbcbbccbbcbcbbccbbbbbbcbcbbbbbbcbbbcccccbccbcbcbbbcbbbbbcbccbbbccbbbbcbbbbccbbcbcbbbbbbbbbcbbb
    cbbbbcbbbbcbcbbbbbbcbcbbbbbbccbbbcbcbbbbbbcbcbbccbccbcbcbbcbbbbbcbcbbbcbbbbcccbccbcbccbbbbcccbbcccbbbcbcbbbccbbcbcbbbccbccbcbcbcbbbbbbcccbbccbbccccbcbbccccbcbbb
    ccbbbbbbcbbcbcbbbbcbcbcbbbbccbcccbccbccbcbbbccbbbbcbbcbbccbbbbcbccbccbcbbcbcccbbcbbbcbbcbbbcbbbcbbbbcbcbcbbcbcbcbbbbbcbbbbccbbcbbbbcbcbbbccbcbbcbcbbbbbccbbbcbbb
    ccbbbcccbcbccbbbbbbcbbbcbccccbbbbbbbbbbbbcbcbbbbccbbbbbccbbbbccbbbcbbbcbbbbbbbcbbbbbbbbbccbbbbcccbbbbbbbbbbbcbbcbbbccbbbbbbbcbbbbbbbccbbbbcbcbbbbbcbbcbccbbcbbcb
    cbbbbcbbbbbcbbcbcbbbbcbbbbbbbbbbcbcbbbbcbbbbbbbbbbbbccbbbcbbbcbbbbcbbcbcbcbccbbbcccccbbcbbbccbbcbcbccbbcbcbcbbbbbcbbcbcbcbbbccbbbbcbcbbccbbbbccbbbcccbcbbbbbcbbc
    bbbbcbbbbbbbcbbcbcbcbbbccbbbcbbbbbbbcbbccbbcccbcccbbbbbccbbbcbbbbbbbbbbbbbcbbbbcbbbbbbbcbbcbbbbbbbcccbbbcbbbbbbcbccccbbbcbcbcbbbccbcbbbbbbbcbbbbbbbcbbbbbcbcbcbb
    cbbbcbbbbbbbbbbbbbbbbbccbbbbbbbccbbbbbbbbcbbbbbbbbcbbbbbbbbbbcbccccbbbbccccbcbcbbcbbccccbbccccbbbbcbcbbbbbccbbccccbbbbbbbbbbbbcbbbbccbbbccbbccbbcbbbbbcbbbbccbbb
    bbcbbccbbbbbbbccbccbbbbbcbbbcbbbccbbbcbcccbccbbbbbbccbbcbbccbbcbbbbbbcbcbbcbbbbbbcbbbbbbbbbbbbbbbbbbbbcbcbbbbbbbbbbccccbcbccbcbcccbbbbbcbbbbbbbbbbccbcbbbcbcbcbb
    bbbbbbbcbccbccbcbbbcbbccbbcbbbbbcbbbcbbcbbbbbcbbbbcbcbccbbbcbcbcbcbbbbccbbbbcbbbbbbbcbbbbccbbccccbbcbbbbbcbbcbbbcbbbbbbbcbbbbbbbbbbbcccbbbcbccbbbcbbbbccbcbbcbbc
    cccbcbbbcbccbbbbbbccbbcbcccbccbcbbbcbbbcbbcbcbccbbccbbbbcbbcbbbbcbbbbbbbcbbbcbbccbccbbbbbcbbbbbbbcbcbcccbbcbccbbcbbbcbbccbbbbccbbcbcbbbbcbbcbbbcbbbcbbbcbbcbcbbb
    bbbcccbcbbbbccbbbbbccbbccbbcbbbcbcbbbbbcbbbcbbbcbcbbcbbbbbcbcbcbbbcbbcbbbbcbcbbbcbbbbcbcbbbbbcbbbcbbcbbbbccbbbbbcbbcbbbccbcbccbccbbbbbcbcbbbbcbbbbbbbbbbbcbbbbbb
    bbcbbbbbcbcbbbbbbbbbbcbbcbcbbbbcbbcbcbcbcbbbcbbbbbbbbbcbbcbbbcbbbbbbcccbbbbbbbcbbbbcbbbbcbcbbcbbbbbbbccbbbbcbcbbcbbbbbbbbbbbbbbbccbbbbbbbbbbcbbbbbbccbbbcbcbbcbb
    bcbbbbbbbcbbbcbbbbbcbbbbbbbbbcbbbbcbbbbbbcbbbbbccbcbcbbbcbbbbcbbcbcbbbbbbbcbbbbbbbbbbbbbcbcbbcbbbbccbbbcbbbcbbcbbbbbcbbbcbbbbbbbbbbbbccbcbbbbcbbcbbbbbcbbbbbbccb
    bbbcbbcbcbbbbbcbcbcbcbbbbbbbcbbbbbbcbbcbcbbbbbbccbbbbcbbbbbcbbbbbbbcbbbbbccbccbbcbbcbccbbbbbcbbbcbbbbbbbbbbbcbbccbbbbcbcbbbccbbbcbbbbcbbbcbccbbbccbbbcbcbbbcbbbc
    bcbbbbcbbbbbbcbbcbbccbbbbcbcbbbbbccbcbbbbbbbccbbcbbbbbcbcbbbcbbbbcbbcbbbbbbcbbcbcbccbbbbbbcbbbcccbbbccbcbbcbcbbbbbbbccbcbbcccbbcbcbcbbbcbbcbccbbbbbccbcbcbbbbcbc
    cbbbcbbbbcbbbbcbbbbbbbbbbbbbcccbbbbbbbbbbccbbbbbbcbbbbcccbbbbbbbcbbbcbbbbbcbbbbbbbcbbbbbbbbbbbbbbbbbbbbcccbcbbcbbbbbbbbbbbcbbbbbbcbbbbbbbccbbbcbbbbbbbbbbbbbbbbb
    bbccbbbccbcbcbcbbbbbcbcccbcbbbbbbcbbcbcbbbcbcbbbbbbbbbbcbbbbbbcbbbbbbbbbcbbbcbbbbbbbcbcbbbbbbbbcccbbbbbbbbbbbbbccbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbcbccbbcbbcbbccbb
    bbbbbbbccbbbbbbbcbcbbbbbbbbbbcbbcbbbcbbbbbbccbbbccbbbbbbbbccccbbccbbbccbbcbbbcbcbbbbcbcbccbcbbcbcbbbbbbbbbbbbbcbbcbcbbbbbbbcccbbbbbccbccbbcbcbbbbbbbbcbbcbbcbbbb
    bcbbbcbccbbbbcbbbcbbbbbbbcbbbbbbbbbcbbbbbbcbbbbcbbbcbcbbbbbbbbbcbbbccbbbbbbcbcbbbbbbbbbbbbbccbbbbbbbbbbcbbccbbbbcbcbbbbbbbbbbbbcbbbccbbbbbbcbcbbbcbbbbcbcbbcbbcb
    bbcbbbbbbbbccbbbbbbcbcbbbccbbbbcbbbbbbbbbbbcbbcbbbbbbbbbbcbbbbbbbbbbbbbbcbbbbbcbbbcbbbbbbcbbbbbcbbbcbbbcbbbbbbbbbbbbbbcbbbbcbbbbbbbbbbcbbbbbbbbbbbcbbbbbbcbbbcbb
    bbbbbbbbcbbbbbbbbbbbbbcbbbbbbbcbbcbbbbcbbbbbbbbcbbbbbbbbbbbcbbcbbcbbbbbcbcbbbbbcbbbbbbbcbbbbbbbbbbbcbbbbbbbbcbbbbbbbbbbbbcbbbcbbcbbbbbbccbcbbbbcbbbbbbbbbbbbbcbb
    bbbcbbcbbbbbbbbcbbbcbcbbbbbbcbbbbbcbbcbcbbbcbbbbccbbcbcbbbcbcbbbbbbcbcbbbbbbbbbbbccbbcbccbbbbbbcbbbccbbbcbbbbbccbcbbbccbbbcbbcbbcbbbbbbbbbbbbbbccbbbccbbbbbbbbbb
    bbcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbcbcbcbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbcbbbbbbbbbbbbbbbbbbcbcbbcbbbbbbcbbbcbbbcbbbbbccbbbbbbbbbcbbbbbbbbbbcbbbcbbbc
    bbbbcbbbcbbbbbbbbbbbbcbcbcbccbbbbbbbbbccbccbbbbbbbcbcbbbbcbbcbbbbbbbccbbbcbbcbbbbbcbbbbbbbbbbbbbbbcbcbbbbbbbbbbbcbbbbbcbbcbbbcbbbbbbbbcbbbcbbbbbbbcbbbcbbbbbcbbb
    bbbcbcbbbbcbbbcbbcbcbbbbbbbcbcbbbbcbcbbbbbcbbbbbbbbbbcbbbbbcbcbcbbcbbbbbbbcbcbbbbccbbbbbbbccbcbbbcbbbbbbbbbbcbbbbbbbbbbbbbbbbbcbbbbbcbbbbbbcbbbbbbbbbbbcbcbbbbbb
    cbbbbbbcbbbbcbcbbbbccbbbbbbbbbcbbbbcbbbbbbbbbbcbcbbbbbbcbbbcbbbbccbbbbcbbbbcbbbbbbbbcbbcbbcbbcbcbbbcbbcbbcbcbcbbcbbbbcbbbbbcbcbbbcbbbbbcbbbccbbcbcbcbbbbbbbccbbb
    bbbcbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbcbbbcbbbbcbbcbbbbbbcbbbbbbcbbbbbbcbbbbbbbcbbbbbbbbbbbbcbbbbbcbbcbbcbbbcbbcbbbbbbcbcbbbbbbbbbcbcbbcbbbbbbb
    bbbbbbbbbbcbbcbbbbcbbbbbbcbbbbcbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbcbbbbbbbccbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbcbbbbbbbbbbbbbcbbbbb
    bbbbbcbcbbbbbbbcbbbbcbbcbbcbcbbbcbbbbbbbbbbbbbbbbbbcbbbbbbbcbbbbbbbbbbbbbcbbbcbbbcbbbbbbbbbbbcbbbbbbcbbbbbbbbbbcbbbbbbbbbbcbbbbcbbbbbbbbbbbbcbbbbbbbbcbbbbbbbbbc
    bcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbccbbbbbccbcbbcbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbcbcbbcbbbbbccbbbbbbbcbbcbbbbcbbbcbbbbbbbbbbbbbbccbbbbbbbbbbbbbbcbbbbbbbbbbbc
    bcbbbbbbcbbbbbcbbbbbbbbbbbccbbbbbbbbbbcccbbbbbcbbbbbbbcbbbbcbbcbbbbbbbbbbbbbcbbbbcbcbbbcbbbbbbcbbbbbbbbbbbbbbbbcbbcbbbbcbbbbbcbcbbbbbbbbbcbbbbbcbbbbbbcbbbbbccbb
    bbbcbbcbbbbbcbbbbbbbbbcbbbbbbbbbbbbcbbbbbbbbcbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbcbbbbbbbbbbccbbbbbbbbbbbbcbbbbbcbbbbbbbbbbcbcbbbbbbbbbbbbbbbbbbbbcbbbbbb
    bbbbbbbbcbbbbbbbbbbcbbbbbbbbbccbcbbbbbbbbbbcbbbbbbbcbbbbbcbbbcbbcbbbbcbbbcbbbbbbbbbbbbbbcbbbbcbbbbbbbbbbcbbcbbbbbbbbbbbbbbcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbcbbbb
    bbbbbbbcbbbbbbbbbcbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbcbbbccbbbbbbbbbbbbbbcbbbbbbbbbbbcbbcbbbbbbbcbbbbbbbbbbbcbbbbbbbbbcbbbbbbcbbbccbcbbbcbbbbbbbbb
    bbbbbbbbbbbbbbbcbbbbcbbbbcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbcbcbbbbbbbbbbbcbbbcbbbbbbbbbbbbbcbbcbbbbbbbbbcbbbcbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbcbbbbbcbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbb
    bbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbcbbbbbbbbcbbbbbbbbbbbbbbbbbbcbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbb
    bbbbbbcbbbcbbbbbcbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbcbbbbcbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbcbbbbbbbbbbcbbbbbbbbbbbbbc
    bbbcbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbcbbbbbcbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbcbbbbbbcbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbb
    bbbbbcbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbcbbbbbbbbcbbbbbbbbbbbbccbbbbcbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbcbbbbbbccbbbbbbbbbbbbbbbbbbbcbbbbbbbbbcbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbcbbbcbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbcbbbbbbbbcbbbbbbbbbcbbbbbbcbbbbbbbbbbbbbbbcbcbbbbbbbbbcbbbbbbbbbbbbbcbbb
    `)
naut = sprites.create(naut_img, SpriteKind.Player)
naut.z = 5
naut.ay = g
tiles.placeOnRandomTile(naut, assets.tile`tile18`)
scene.cameraFollowSprite(naut)
info.setLife(3)
forever(function () {
    if (controller.left.isPressed()) {
        direction_x = -1
    }
    if (controller.right.isPressed()) {
        direction_x = 1
    }
})
forever(function () {
    updatePlayerSprite()
    updateGrappling()
})
