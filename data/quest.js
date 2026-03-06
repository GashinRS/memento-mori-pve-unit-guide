const QUEST_UNITS = [
    {
        id: "Belle",
        name: "Belle",
        role: "Tank",
        scalable: true,
        weapons: [],
        pairs: [
            {id: "Dian", name: "Dian", badge: "dps"},
            {...u("FiaLR5"), badge: "dps"},
            {...u("Fia"), badge: "support"}
        ],
        teams: [
            {label: null, slots: [u('Belle'), u('Fia'), u('Dian'), u('Merlyn'), u('Milla')]},
            {label: null, slots: [u('Belle'), u('FiaLR5'), u('Merlyn'), u('Yildiz'), u('Milla')]},
        ],
        desc: `
        <p>Belle is a very unique unit; she has a passive that can grant her shields based on the amount of damage she
        would have taken. This is very powerful in main quest, as enemies tend to deal a lot more damage than in tower.
        She is mostly used in two specific teams, but her role in both is the same, where she acts as a sponge to soak
        up hits. Her main weakness is that the shields are dispellable, so she will not work on stages where enemies
        have a dispel skill. Another weakness is that enemies who heal based on damage dealt can infinitely heal off
        Belle, which makes defeating them very hard. The latter can be somewhat countered with high evasion, but this 
        solution is less than ideal given the amount of RNG it still requires. Given that she needs to survive at least
        one hit in order to activate her shield, higher rarities will help with bulk by giving her more HP. It is not recommended to go
        beyond LR for this purpose.</p> 
        <br>
        <p>In the first example team, Dian is the main DPS. Since Dian can get the Invisibility buff when at least
         one ally is alive, Belle can act as the immortal partner which allows Dian to continuously chip away at the enemies
         which her direct damage from her S2.</p>
        <p>In the second team, LR5 Fia is the main DPS. Due to the high damage main quest enemies can deal, Fia can 
        still struggle to survive even with Yildiz's buff, so Belle is here to act as an unit to take some off the tanking
        load off Fia. </p>
        <br>
        <p><strong>Speed Tuning — </strong> No speed tuning is required</p>
      `
    },

    {
        id: "SmoddeySR",
        name: "Summer Moddey",
        role: "Support - DPS",
        scalable: true,
        weapons: [
            {
                level: "SmoddeyUR",
                tier: "required",
                description: "todo",
            },
        ],
        pairs: [
            {...u('Moineau'), badge: "dps"},
            {id: "Cordie", name: "Cordie", badge: "support"},
            {...u("Eirene"), badge: "support"},
        ],
        teams: [
            {label: null, slots: [u('Cordie'), u('Merlyn'), u('Moineau'), u('SmoddeySR'), u('Eirene')]},
            {label: null, slots: [u('Cordie'), u('Xamour'), u('SmoddeyUR'), u('Artie'), u('LunaLR')]}
        ],
        desc: `
        <p>As mentioned in Moineau's section, Summer Moddey is the main catalyst that allows for the highest damage dealing
        team in the entire game, under the right circumstances. For details on how that works, please refer to Moineau's
        section. </p>
        
        <p>What is not covered in that section however is the fact that Summer Moddey herself can also be a great DPS due to
        the very same attack buff that Moineau copies from her. While the damage output is not as high as Moineau, she
        can act as a viable sub DPS for Moineau when geared properly and also has some viability as a stand alone DPS.
        The latter can be seen with example team 2, where you will want at least UR+ rarity for the additional stats.
        This team focuses more on damage spread over 4 turns (with Winter Amour reducing cooldown) compared to Moineau's
        2 turn burst. In most cases, the team with Moineau will outperform solo Summer Moddey, but there are scenarios
        where you will want Luna's silence to survive the first turn. Luna is a unit that cannot be fit onto the team
        with Moineau without heavily compromising the damage dealt. Also note how this team includes Artie; she is an 
        alternative to Eirene by providing a 40% M.DEF debuff as well as a 20% increase in damage taken for the enemies.
        Artie also has the added benefit of being a lot bulkier than Eirene, which allows her to take more hits from
        silenced enemies.</p>
        <br>
        <p><strong>Speed Tuning — </strong>When using her with Moineau, you should make sure that she is faster than
        Moineau so her attack buff can get copied by Moineau. When using Summer Moddey on her own, the main things to 
        make sure are that she is not the slowest unit in order to get Winter Amour's crit buff, and that she is
         slower than Cordie so she can make use of Cordie's defense debuff.</p>
      `
    },
]