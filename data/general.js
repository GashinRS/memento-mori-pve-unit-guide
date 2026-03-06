const GENERAL_UNITS = [
    {
        id: "Sivi",
        name: "Sivi",
        role: "Support",
        weapons: [
            {
                level: "SiviUR",
                tier: "recommended",
                description: "todo",
            }
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
        ],
        teams: [
            {label: null, slots: [u('Mertillier'), u('Sivi'), u('Cordie'), u('Merlyn'), u('LunaLR')]},
        ],
        desc: `
        <p>Sivi is currently the only character in the game with the [Increased Damage Dealing] buff. The multiplier for
        this buff goes up to 90%, which ends up making Sivi one of the best damage buffers in the game. The main downside
        is that higher multipliers require the buff targets to be hit multiple times before Sivi uses her S1 (which is 
        what provides the buff). This means that you always want Sivi to go last to increase the chance of getting 
        more hits, risking both Sivi and the buff targets dying before Sivi can act. As a result, Sivi requires more
        gear than most other supports, and also assumes that your buff target has adequate gear as well. This can be
        somewhat alleviated by the fact that she has a passive 100 % DEF and P.DEF buff and can also provide adjacent
        allies with a passive 25% buff to their DEF and P.DEF. The staple team with Sivi, also simply called "Cordie Sivi" is shown as the first
        example. This is a universally useful team that will especially be able to clear a lot of tower floors without
        the need to change teams. It is definitely not always the best team to use, but very often an effective one.</p>
    <br>
    <p><strong>Speed Tuning —</strong>Players should take care to correctly speed tune your team when using Sivi, as her S1 buff targets the two
        allies with the lowest speed other than Sivi. This means that your main DPS cannot be the fastest or second-fastest unit on your team.</p>
       
        
      `
    },

    {
        id: "XTropon1",
        name: "Winter Tropon",
        role: "Tank - Sub DPS",
        weapons: [
        ],
        pairs: [
            {...u('Fia'), badge: "required"},
            {...u('Dian'), badge: "dps"},
            //{...u('Nina1'), badge: "dps"},
        ],
        teams: [
            {label: null, slots: [u('Milla'), u('Merlyn'), u('Dian'), u('Fia'), u('XTropon1')]},
        ],
        desc: `
        <p>Winter Tropon is a rather niche unit that, while not universally useful, can be a very powerful tool in specific
        scenarios. Due to how stat scaling and the damage formula work, all stats except for HP and speed are essentially
        worth a lot more on low level units (the specifics with examples will be explained in another section which will 
        get added at a later date). This game mechanic pairs incredibly well with her S1, which absorbs 15% of an enemy's
        attack and defense into her own attack and defense. This basically makes her immortal as long as her buff is active,
        given the high defense values PVE enemies have. The only requirement for this is that you pair her with Fia
        to buff her HP, since at level 1 her base HP will be really low.
        <br><br>
        Something to take into consideration are the two turns where her buff is not active, since she is a lot more 
        vulnerable during those turns. This means she performs best against enemies with a 4 turn cooldown cycle like 
        herself, so she can match her stat absorption with the enemies' skill activations.
        <br>
        Something that can help with extra bulk during the turns she is vulnerable is P.DEF and M.DEF. These stats are
        generally relatively useless on normal units, but work really well for level 1 units. The main source of this 
        is from STR and MAG runes since those stats are mapped one to one with P.DEF and M.DEF respectively. Another way
        to get more P.DEF and M.DEF is simply through P.DEF and M.DEF runes.</p>
        <br>
    <p><strong>Main Quest —</strong>Winter Tropon loses her value in main quest after turn 20, because her S1 counts as 
     a debuff for enemies, and enemies in main quest cannot get debuffed past turn 20.</p>
    <p><strong>Speed Tuning —</strong>Winter Tropon wants her buff to be active as soon as possible, so she should move
    before any of the enemy units.</p>
      `
    },

    {
        id: "XSol",
        name: "Winter Soltina",
        role: "Support",
        weapons: [
            {
                level: "XSolSSR",
                tier: "required",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
            {id: "Meria", name: "Meria", badge: "support"},
        ],
        teams: [
            {label: null, slots: [u('XSol'), u('Merlyn'), u('Cordie'), u('Meria'), u('Eirene')]}
        ],
        desc: `
        <p>Winter Soltina's S1 can buff the highest attack ally for 60% attack and 30% accuracy if they are Crimson or Emerald (Cordie). 
        Unlike most buffs, this buff lasts for 32 turns and cannot be dispelled so it is guaranteed to be active for 
        most if not all of the battle. It is a very simple but effective buff that is especially good in longer battles,
        and thus pairs very well with Meria who can help with survival.</p>
        <br>
    <p><strong>Speed Tuning —</strong> As she is an active buffer, you want her to move before your main DPS (Cordie).
    This does not require a lot of speed runes in most cases due to Winter Soltina having an innate 30% speed buff.</p>
      `
    },

    {
        id: "Fia",
        name: "Fia",
        role: "Support - DPS",
        scalable: true,
        weapons: [
            {
                level: "FiaUR",
                tier: "required",
                description: "todo",
            },
            {
                level: "FiaLR",
                tier: "recommended",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Yildiz", name: "Yildiz", badge: "support"},
            {id: "Milla", name: "Milla", badge: "support"},
            // {id: "Nina1", name: "Nina", badge: "dps"},
        ],
        teams: [
        ],
        desc: `
        <p>Fia is without a doubt one of the most important limited units you can pull for PVE. Technically she is usable
        at UR+ rarity, but Fia is the only unit on this entire list that gets a firm recommendation to LR. She is unique
        in the sense that she can act as both a support unit and DPS. 
        <br><br>
        Fia's support comes from her passive that increases adjacent allies' HP by 50% of her own, which greatly contributes
        to the effectiveness of level 1 strategies and units that rely on their HP to deal damage like Dian. This buff
        does not however contribute much to general survivability of other units, as other means such as barriers and
        buffing defense are more suited for this.
        <br><br>
        Fia can also act as a strong DPS option because her S2 deals direct damage based on damage dealt to her. Direct
        damage bypasses enemy defenses and also does not require any attack or PMDB from the attacker. Because Fia also
        buffs her own HP, this directly affects how much damage she can deal, as being able to take more damage (higher HP) 
        also means more damage dealt. This means that the only offense stats Fia requires are crit rate, crit damage and
        HP.
        <br><br>
        Because both her support and DPS roles require as much HP as possible, the gear should also reflect this, as you
        want set bonuses that boost HP and stamina. For an LR Fia, the standard gear setup would be 4 UR + 2 SSR. Because
        Fia scales with her HP, getting her to LR5 can also be a good option for the added HP and the ability to use 
        4 LR instead of 4 UR gear for even more HP.</p>
       <br>
    <p><strong>Main Quest —</strong> Fia's support role is most prevalent in main quest where you will often
    use her to buff up level 1 Nina (and sometimes Winter Tropon's) HP. If you want to use her as a DPS, Yildiz is a 
    must-have for the additional bulk, and LR5 also improves her performance by a big amount.</p>
       
    <p><strong>Tower —</strong>In tower Fia will mostly be used as a DPS. Because of lower enemy attack stats compared to
    main quest, Yildiz is not required and LR should be more than enough to perform adequately in most scenarios. An issue you can run into
    sometimes in tower when pairing her with Yildiz is that she becomes too bulky, which reduces her damage, so this is
    something to take into account.</p>

    <p><strong>Speed Tuning —</strong> In most cases you do not want any speed on her, because taking another hit before
    being able to attack will increase her damage. There are cases where attacking first can be beneficial however. This 
    can for example be the case when facing Amour, as attacking first will let you avoid the Blight debuff, which prevents healing.</p>
      `
    },

    {
        id: "Yildiz",
        name: "Yildiz",
        role: "Support",
        weapons: [
            {
                level: "YildizUR",
                tier: "required",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Fia", name: "Fia", badge: "dps"},
            {...u('Cordie'), badge: "dps"},
        ],
        teams: [
        ],
        desc: `
        <p>Yildiz can buff the highest attack ally for 80% DEF, 80% P.DEF and 40% P.CRIT CUT if they are an Emerald unit.
        This is one of if not the best defensive buff in the game and enables Fia to perform her DPS role in main quest
        much more effectively, due main quest enemies otherwise having too much attack for Fia to reliably survive in
        most stages. Another great target of this buff is Cordie, but this is more useful in tower because Cordie's 
        survivability in main quest is still not great even with Yildiz.</p>
        <br>
        <p><strong>Speed Tuning — </strong>Since Yildiz's S1 can inflict Buff Immunity on enemies, you will want her to
        move before the enemies or your DPS in some scenarios.</p>
      `
    },

    {
        id: "Milla",
        name: "Milla",
        role: "Support",
        scalable: true,
        weapons: [
            {
                level: "MillaUR",
                tier: "recommended",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Fia", name: "Fia", badge: "dps"},
            {...u('Dian'), badge: "dps"},
        ],
        teams: [
        ],
        desc: `
        <p>Milla can increases the max HP of all allies by 25% and also increase Emerald allies' by an additional 200% 
        of her attack. While her role may seem similar to Fia's at first glance, Milla is almost exclusively used to buff
        Fia's HP or buff another unit's HP along with Fia and is rarely used on her own without Fia. Due to the general
        usefulness of Fia however, any unit that works well with her can be considered a good support unit, which is
        exactly what Milla is.
        <br><br>
        Milla also scales with rarity due to higher rarities being able to hit higher attack stats for a bigger HP buff
        as well as more survivability which may allow her to reactivate her passive HP regeneration support.</p>
        <br>
          <p><strong>Speed Tuning — </strong> No speed tuning is required</p>
      `
    },

    {
        id: "Moineau",
        name: "Moineau",
        role: "Support - DPS",
        scalable: true,
        weapons: [
            {
                level: "MoineauSSR",
                tier: "required",
                description: "todo",
            },
            {
                level: "Moineau200SSR",
                tier: "optional",
                description: "todo",
            },
            {
                level: "MoineauUR",
                tier: "optional",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
            {...u('SmoddeyUR'), badge: "dps"},
            {...u('SmoddeySR'), badge: "support"},
        ],
        teams: [
            {label: null, slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('Samleth'), u('Meria')]},
            {label: null, slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('Samleth'), u('Eirene')]},
            {label: null, slots: [u('Cordie'), u('Meria'), u('Moineau'), u('Samleth'), u('Eirene')]},
            {label: "Main quest only", slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('SmoddeySR'), u('Eirene')]}
        ],
        desc: `
        <p>Moineau has a ton of effects, which combined, make her into one of the best support units in the game that can even
        be used as a very strong DPS in certain scenarios. Her S1 inflicts Enfeeble on enemies, which decreases their 
        attack by 40%. Her S1 also decreases enemies' P.DEF by 25% in main quest and by 50% in tower. Her S2 inflicts 
        Delay on enemies which delays the activation of enemy skills by 1 turn. This specific debuff is not as good
        as the other parts of her kit, but still a nice to have. Additionally, Moineau also gets a shield equal to 800%
        of her attack, and can copy all buffs from the ally with the highest amount of buffs at the start of her
        action phase. Due to the vast nature of her effects, her usage in tower and main quest differs a lot.</p>
    <br>
  <p><strong>Main Quest — </strong> Moineau's primary role in main quest is as a DPS. This is made possible by
        using Summer Moddey as the catalyst. Summer Moddey can absorb 30% of an enemy's attack into her own, and Moineau
        can then copy this attack buff to do an insane amount of damage. The damage dealt by this is the highest burst
        damage in the game that any unit can deal in 1-2 turns. The main downside is that this only really works when
        the stage has NPCs, because those always have much higher attack stats than regular units, which you need in 
        order to increase your own attack stat. Another downside is that the team required for this is very inflexible,
        as you want to debuff the enemies' defense to 0. This requires both Cordie and Eirene, making Merlyn the only
        flexible slot, who realistically speaking you won't be able to replace due to her crit rate and crit damage
        buff being very valuable to maximize Moineau's damage output. While getting more copies of Moineau does not affect
        her performance much in tower, in main quest the added rarity will help with accuracy and crit rate, reducing the
        RNG required to clear stages.</p>

  <p><strong>Tower — </strong> In tower, she is only used as a debuffer, where her 50% P.DEF debuff can pair with another unit's 50% P.DEF debuff
        like Summer Amleth's, causing enemies to have 0 P.DEF due to these debuffs stacking additively. When enemies have
        0 P.DEF, PMDB stops becoming a bottleneck because it simply does not do anything if there is no P.DEF to decrease.
        As a result, this can also be paired with Eirene, such that Eirene's and Cordie's debuffs combined also put the 
        enemies at 0 defense in order to do "true" damage where all enemy defensive stats are ignored and essentially
        turning every attack into a direct attack. This strategy is very effective and will work on most tower floors.
        Note that this does not work in main quest because both Moineau's and Summer Amleth's P.DEF debuffs are only
        debuffing for 25% instead of 50% in main quest. The Enfeeble debuff is also a very welcome bonus to make survival 
        easier. </p>

  <p><strong>Speed Tuning — </strong> As a debuffer, you want her to act before your main DPS. As a DPS, you want her to
  act last, making sure the enemy team is fully debuffed before attacking into them.</p>
      `
    },

    {
        id: "Samleth",
        name: "Summer Amleth",
        role: "Support",
        weapons: [
            {
                level: "SamlethSSR",
                tier: "recommended",
                description: "todo",
            },
            {
                level: "SamlethUR",
                tier: "recommended",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
            {...u("Moineau"), badge: "support"},
        ],
        teams: [
            {label: "Common main quest team", slots: [u('Cordie'), u('Merlyn'), u('XSol'), u('Samleth'), u('Meria')]},
            {label: "Common tower team", slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('Samleth'), u('Meria')]},
            {label: "If you don't have Moineau", slots: [u('Cordie'), u('Merlyn'), u('Tama'), u('Samleth'), u('Meria')]},
        ],
        desc: `
        <p>Summer Amleth's main support comes from her S1, which decreases enemies' P.DEF by 25% and 50% in main quest and
        tower respectively. She has the added benefit of being able to take a certain amount of hits without dying 
        thanks to her passive The Queen's Resolve. <p>
        <br>
          <p><strong>Speed Tuning — </strong> Since she is a debuffer, you want her to act before your main DPS.</p>
      `
    },

    {
        id: "Xamour",
        name: "Winter Amour",
        role: "Support",
        weapons: [
            {
                level: "XamourSSR",
                tier: "recommended",
                description: "todo",
            },
            {
                level: "XamourUR",
                tier: "recommended",
                description: "todo",
            },
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
            {...u("Florence"), badge: "dps"},
            {...u("LunaLR"), badge: "support"},
        ],
        teams: [
            {label: null, slots: [u('Cordie'), u('Merlyn'), u('Florence'), u('Xamour'), u('LunaLR')]}
        ],
        desc: `
        <p>Winter Amour is a unit designed for double DPS teams, more specifically for Flordie (Florence + Cordie) teams.
        Her main supportive effect reduces the cooldown of the two highest attack allies by 2 and also increases their attack
        by up to 40% when she is defeated. She is not worth using in single DPS teams because Mertillier has the same -2 
        cooldown reduction, but gives a higher attack buff as well as a defense buff for a single ally instead of two. 
        Because Winter Amour can also buff the everyone's crit rate except for the slowest unit on the team, she also
        pairs well with Luna because it frees up Luna from taking the position next to Merlyn, which can now be occupied
        by your second DPS.</p>
        <br>
        <p><strong>Speed Tuning — </strong> The crit buff is granted with her S1, so she wants to be the first unit to act to 
        give out this buff.</p>
      `
    },

    {
        id: "Eirene",
        name: "Eirene",
        role: "Support",
        weapons: [
            {
                level: "EireneSSR",
                tier: "recommended",
                description: "todo",
            },
            {
                level: "EireneUR",
                tier: "optional",
                description: "todo",
            }
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
        ],
        teams: [
            {label: "Common main quest team", slots: [u('Cordie'), u('Merlyn'), u('Florence'), u('Eirene'), u('Meria')]},
            {label: "Common tower team", slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('Samleth'), u('Eirene')]},
        ],
        desc: `
        <p>Eirene is one of the few units in the game who can debuff defense (25% in main quest, 50% in tower), 
        which is an incredibly powerful debuff. 
        It is better than P.DEF debuffs due to defense contributing more to bulk. When you pair her with Cordie,
        you can even get enemies down to 0 defense which can allow you to beat stages that would otherwise have way too 
        much defense to beat with some other teams. She also has an additional effect where the slowest ally on the team
        can get a 1 turn cooldown reduction when they use their first auto attack. </p>
        <br>
        <p><strong>Main Quest — </strong>Eirene's debuff is undispellable in main quest, which means that you do not
        need any debuff accuracy for the debuff to land. It even works on units with debuff immunity (Cordie).</p>
        
        <p><strong>Speed Tuning — </strong> Since Eirene is a debuffer, you want her to act before your main DPS. Another
        thing to take into account is that when possible, you want your main DPS to be the slowest unit on your team
        to get the extra cooldown reduction. When this is not possible due to a lack of speed runes, having Meria
        as the slowest unit is also a good option since she can replenish her barriers faster that way.</p>
      `
    },

    {
        id: "Meria",
        name: "Meria",
        role: "Support",
        weapons: [
            {
                level: "MeriaSSR",
                tier: "recommended",
                description: "Grants an extra S1 hit thus an extra barrier, greatly contributing to survival",
            },
            {
                level: "MeriaUR",
                tier: "optional",
                description: `Grants 10% team wide speed buff if there are 3 or more allies (including Meria) with 
                        the same soul. Generally not that useful for PVE because enemies do not tend to be fast, but can
                        occasionally come in handy.`
            },
        ],
        pairs: [
            {id: "Cordie", name: "Cordie", badge: "dps"},
        ],
        teams: [
        ],
        desc: `
        <p>Meria is one of the most universally useful support units in the game and can fit into almost any team, making her
        a must pull. The reason for this is a passive effect that grants her a barrier for every hit she does. 
        When she already has 4 barriers, the extra barriers overflow to the ally with the highest attack. Because her S1
        hits 5 times, this means that she will immediately grant 4 barriers to herself and 1 to the highest attack ally.
        Her S2 hits 5 times as well, which can immediately replenish broken barriers. This makes for a powerful survival tool, and 
        hard counters most units that rely on AoE attacks like Soltina since they do not have the necessary hits to break
        the barriers.<p>
        <br>
        <p><strong>Speed Tuning — </strong>In most cases Meria's speed does not matter that much. Because she already
        has an innate 20% speed buff, she will be faster than most enemies without any speed runes and will thus
        already grant her barriers before the enemies can act. When this is not the case, giving her
        a bit of speed runes can help.</p>
      `
    },
]