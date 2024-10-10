<?php

namespace App\Enums;

enum CurrencySeparators: string
{
    case COMMA = ',';
    case DOT = '.';
    case SPACE = '|'; // This is a pipe character, will represent a space when formatting a currency.
    case UNDERSCORE = '_';
    case NONE = '';
}
